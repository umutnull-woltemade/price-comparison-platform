import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { metricsMiddleware } from './middleware/metrics';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: process.env.CORS_CREDENTIALS === 'true'
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Metrics
if (process.env.ENABLE_METRICS === 'true') {
  app.use(metricsMiddleware);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(`/api/${API_VERSION}`, limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'api-gateway',
    version: API_VERSION
  });
});

// API Documentation
app.get(`/api/${API_VERSION}/docs`, (req, res) => {
  res.json({
    name: 'Price Comparison Platform API',
    version: API_VERSION,
    description: 'Modern fiyat karşılaştırma ve cashback platformu API',
    endpoints: {
      auth: `http://localhost:${PORT}/api/${API_VERSION}/auth/*`,
      users: `http://localhost:${PORT}/api/${API_VERSION}/users/*`,
      products: `http://localhost:${PORT}/api/${API_VERSION}/products/*`,
      cashback: `http://localhost:${PORT}/api/${API_VERSION}/cashback/*`,
      notifications: `http://localhost:${PORT}/api/${API_VERSION}/notifications/*`,
      analytics: `http://localhost:${PORT}/api/${API_VERSION}/analytics/*`,
    },
    documentation: 'https://docs.example.com'
  });
});

// Service Proxies
const serviceProxies = [
  {
    path: `/api/${API_VERSION}/auth`,
    target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    requireAuth: false
  },
  {
    path: `/api/${API_VERSION}/users`,
    target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    requireAuth: true
  },
  {
    path: `/api/${API_VERSION}/products`,
    target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    requireAuth: false
  },
  {
    path: `/api/${API_VERSION}/cashback`,
    target: process.env.CASHBACK_SERVICE_URL || 'http://localhost:3003',
    requireAuth: true
  },
  {
    path: `/api/${API_VERSION}/notifications`,
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
    requireAuth: true
  },
  {
    path: `/api/${API_VERSION}/analytics`,
    target: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3007',
    requireAuth: true
  }
];

serviceProxies.forEach(({ path, target, requireAuth }) => {
  const middleware = requireAuth ? [authMiddleware] : [];

  app.use(
    path,
    ...middleware,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: ''
      },
      onError: (err, req, res) => {
        logger.error(`Proxy error for ${path}:`, err);
        res.status(503).json({
          error: 'Service Unavailable',
          message: 'The requested service is currently unavailable',
          service: path
        });
      },
      onProxyReq: (proxyReq, req) => {
        logger.debug(`Proxying ${req.method} ${req.url} to ${target}`);
      }
    })
  );

  logger.info(`Registered proxy: ${path} -> ${target} (auth: ${requireAuth})`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 API Gateway Started Successfully!                    ║
║                                                            ║
║   Environment: ${process.env.NODE_ENV}                           ║
║   Port: ${PORT}                                              ║
║   API Version: ${API_VERSION}                                   ║
║                                                            ║
║   📚 API Docs: http://localhost:${PORT}/api/${API_VERSION}/docs     ║
║   ❤️  Health: http://localhost:${PORT}/health                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
