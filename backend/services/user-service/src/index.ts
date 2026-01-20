import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   👤 User Service Started Successfully!                   ║
║                                                            ║
║   Environment: ${process.env.NODE_ENV}                           ║
║   Port: ${PORT}                                              ║
║                                                            ║
║   📚 Endpoints:                                            ║
║      POST /auth/register                                   ║
║      POST /auth/login                                      ║
║      POST /auth/refresh                                    ║
║      POST /auth/logout                                     ║
║      POST /auth/forgot-password                            ║
║      POST /auth/reset-password                             ║
║      POST /auth/verify-email                               ║
║      GET  /auth/google                                     ║
║      GET  /users/me                                        ║
║      PUT  /users/me                                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
