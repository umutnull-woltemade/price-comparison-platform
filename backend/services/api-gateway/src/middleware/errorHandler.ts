import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.url}`, {
      error: err.message,
      stack: err.stack,
      statusCode
    });
  } else {
    logger.warn(`${req.method} ${req.url}`, {
      error: err.message,
      statusCode
    });
  }

  // Send error response
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : err.name || 'Error',
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    }),
    timestamp: new Date().toISOString(),
    path: req.url
  });
};

export class ValidationError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
