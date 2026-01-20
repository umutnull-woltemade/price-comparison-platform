import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { logger } from '../utils/logger';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: error.type === 'field' ? (error as any).path : undefined,
      message: error.msg
    }));

    logger.warn('Validation failed:', { errors: formattedErrors, path: req.path });

    res.status(400).json({
      error: 'Validation failed',
      details: formattedErrors
    });
    return;
  }

  next();
};
