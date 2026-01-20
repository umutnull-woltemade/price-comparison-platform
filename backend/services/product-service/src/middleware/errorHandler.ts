import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
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
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this value already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference to related record';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.url}`, {
      error: err.message,
      stack: err.stack,
      statusCode,
      body: req.body,
      params: req.params,
      query: req.query
    });
  } else {
    logger.warn(`${req.method} ${req.url}`, {
      error: err.message,
      statusCode,
      body: req.body
    });
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : err.name || 'Error',
    message:
      statusCode >= 500 && process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    }),
    timestamp: new Date().toISOString(),
    path: req.url
  });
};

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
