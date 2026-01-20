import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { nanoid } from 'nanoid';

export const trackClick = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, storeId, affiliateId, userId } = req.body;
    const clickId = nanoid(32);

    const click = await prisma.affiliateClick.create({
      data: {
        clickId,
        productId,
        storeId,
        affiliateId,
        userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer
      }
    });

    res.json({ clickId: click.clickId });
  } catch (error) {
    logger.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
};

export const trackConversion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clickId, orderId, amount } = req.body;

    const click = await prisma.affiliateClick.findUnique({
      where: { clickId }
    });

    if (!click) {
      res.status(404).json({ error: 'Click not found' });
      return;
    }

    await prisma.affiliateClick.update({
      where: { clickId },
      data: {
        converted: true,
        orderId
      }
    });

    const commissionRate = parseFloat(process.env.DEFAULT_CASHBACK_RATE || '2.5');
    const cashbackAmount = amount * (commissionRate / 100);

    if (click.userId) {
      await prisma.cashbackTransaction.create({
        data: {
          userId: click.userId,
          accountId: click.userId,
          type: 'PENDING',
          amount: cashbackAmount,
          status: 'PENDING',
          orderId,
          orderAmount: amount,
          storeId: click.storeId,
          productId: click.productId,
          commissionRate,
          affiliateId: click.affiliateId
        }
      });
    }

    res.json({ success: true, cashbackAmount });
  } catch (error) {
    logger.error('Track conversion error:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
};

export const getAffiliateStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const [totalClicks, totalConversions, totalEarned] = await Promise.all([
      prisma.affiliateClick.count({
        where: {
          userId,
          createdAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.affiliateClick.count({
        where: {
          userId,
          converted: true,
          createdAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.cashbackTransaction.aggregate({
        where: {
          userId,
          type: { in: ['PENDING', 'APPROVED'] },
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: { amount: true }
      })
    ]);

    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    res.json({
      stats: {
        totalClicks,
        totalConversions,
        conversionRate: conversionRate.toFixed(2),
        totalEarned: totalEarned._sum.amount || 0
      }
    });
  } catch (error) {
    logger.error('Get affiliate stats error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate stats' });
  }
};
