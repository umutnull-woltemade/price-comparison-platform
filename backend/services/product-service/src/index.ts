import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { metricsMiddleware } from './middleware/metrics';

// Routes
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import brandRoutes from './routes/brand.routes';
import storeRoutes from './routes/store.routes';
import reviewRoutes from './routes/review.routes';
import searchRoutes from './routes/search.routes';

// Utils
import { initElasticsearch } from './utils/elasticsearch';
import { initCronJobs } from './utils/cron';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(metricsMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'product-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/stores', storeRoutes);
app.use('/reviews', reviewRoutes);
app.use('/search', searchRoutes);

// Error handler
app.use(errorHandler);

// Initialize services
const initServices = async () => {
  try {
    // Initialize Elasticsearch
    await initElasticsearch();
    logger.info('Elasticsearch initialized');

    // Initialize cron jobs
    initCronJobs();
    logger.info('Cron jobs initialized');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    await initServices();

    app.listen(PORT, () => {
      logger.info(`🚀 Product Service running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

export default app;
