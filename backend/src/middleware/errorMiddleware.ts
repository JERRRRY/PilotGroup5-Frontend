import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
  path?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const path = req.originalUrl;

  // Log error
  console.error({
    timestamp,
    message: err.message,
    stack: err.stack,
    path,
    method: req.method,
  });

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetail = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    // Log operational errors
    if (err.isOperational) {
      console.warn(`[${statusCode}] ${message}`);
    } else {
      console.error(`[CRITICAL] Non-operational error: ${message}`);
    }
  } else {
    // Handle unexpected errors
    console.error('[CRITICAL] Unexpected error:', err);
    message = 'An unexpected error occurred';
  }

  const errorResponse: ErrorResponse = {
    success: false,
    message,
    statusCode,
    timestamp,
    path,
  };

  // Only include error details in development or if it's an operational error
  if (process.env.NODE_ENV === 'development' || (err instanceof AppError && err.isOperational)) {
    errorDetail = err instanceof AppError ? err.message : undefined;
  }

  if (errorDetail) {
    errorResponse.error = errorDetail;
  }

  res.status(statusCode).json(errorResponse);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  res.status(404).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
