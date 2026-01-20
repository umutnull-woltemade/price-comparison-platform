import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface MetricsData {
  totalRequests: number;
  totalErrors: number;
  requestsByMethod: Record<string, number>;
  requestsByPath: Record<string, number>;
  responseTimeAvg: number;
  responseTimes: number[];
}

const metrics: MetricsData = {
  totalRequests: 0,
  totalErrors: 0,
  requestsByMethod: {},
  requestsByPath: {},
  responseTimeAvg: 0,
  responseTimes: []
};

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Increment request count
  metrics.totalRequests++;

  // Track requests by method
  metrics.requestsByMethod[req.method] =
    (metrics.requestsByMethod[req.method] || 0) + 1;

  // Track requests by path
  const path = req.path || 'unknown';
  metrics.requestsByPath[path] = (metrics.requestsByPath[path] || 0) + 1;

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = function (body: any): Response {
    const responseTime = Date.now() - startTime;

    // Track response time
    metrics.responseTimes.push(responseTime);
    if (metrics.responseTimes.length > 1000) {
      metrics.responseTimes = metrics.responseTimes.slice(-1000);
    }

    // Calculate average response time
    metrics.responseTimeAvg =
      metrics.responseTimes.reduce((a, b) => a + b, 0) /
      metrics.responseTimes.length;

    // Track errors
    if (res.statusCode >= 400) {
      metrics.totalErrors++;
    }

    logger.debug(`${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms`);

    return originalJson(body);
  };

  next();
};

export const getMetrics = (): MetricsData & {
  uptime: number;
  timestamp: string;
} => {
  return {
    ...metrics,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
};

// Reset metrics every hour
setInterval(() => {
  logger.info('Resetting metrics counters');
  metrics.totalRequests = 0;
  metrics.totalErrors = 0;
  metrics.requestsByMethod = {};
  metrics.requestsByPath = {};
  metrics.responseTimes = [];
}, 3600000); // 1 hour
