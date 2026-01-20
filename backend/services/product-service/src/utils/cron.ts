import cron from 'node-cron';
import { logger } from './logger';
import { prisma } from './prisma';
import { indexProduct } from './elasticsearch';

// Update price histories and sync with Elasticsearch
const updatePriceHistories = async (): Promise<void> => {
  try {
    logger.info('Starting price history update job...');

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
        store: true
      }
    });

    let updated = 0;
    for (const product of products) {
      // Create price history entry
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          storeId: product.storeId,
          price: product.currentPrice,
          discount: product.discount,
          inStock: product.inStock,
          currency: product.currency
        }
      });

      // Re-index in Elasticsearch
      await indexProduct(product);
      updated++;
    }

    logger.info(`Price history update completed: ${updated} products updated`);
  } catch (error) {
    logger.error('Price history update job failed:', error);
  }
};

// Cleanup old price histories (keep last 90 days)
const cleanupOldData = async (): Promise<void> => {
  try {
    logger.info('Starting cleanup job...');

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.priceHistory.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo
        }
      }
    });

    logger.info(`Cleanup completed: ${result.count} old price histories deleted`);
  } catch (error) {
    logger.error('Cleanup job failed:', error);
  }
};

// Initialize cron jobs
export const initCronJobs = (): void => {
  // Update price histories every 6 hours
  const priceUpdateCron = process.env.PRICE_UPDATE_CRON || '0 */6 * * *';
  cron.schedule(priceUpdateCron, async () => {
    await updatePriceHistories();
  });

  logger.info(`Price update cron job scheduled: ${priceUpdateCron}`);

  // Cleanup old data daily at 2 AM
  const cleanupCron = process.env.CLEANUP_CRON || '0 2 * * *';
  cron.schedule(cleanupCron, async () => {
    await cleanupOldData();
  });

  logger.info(`Cleanup cron job scheduled: ${cleanupCron}`);
};
