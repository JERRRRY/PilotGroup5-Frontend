import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const validateCreateCourse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, thumbnail } = req.body;

  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required and must be a non-empty string');
  }

  if (!thumbnail || typeof thumbnail !== 'string' || thumbnail.trim().length === 0) {
    errors.push('thumbnail is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }

  next();
};

export const validateUpdateCourse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, thumbnail } = req.body;

  const errors: string[] = [];

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    errors.push('title must be a non-empty string');
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim().length === 0)) {
    errors.push('description must be a non-empty string');
  }

  if (thumbnail !== undefined && (typeof thumbnail !== 'string' || thumbnail.trim().length === 0)) {
    errors.push('thumbnail must be a non-empty string');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }

  next();
};

export const validateAddPage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { order, type, title } = req.body;

  const errors: string[] = [];

  if (order === undefined || !Number.isInteger(order) || order < 1) {
    errors.push('order is required and must be a positive integer');
  }

  if (!type || !['video', 'text', 'quiz', 'image'].includes(type)) {
    errors.push("type is required and must be one of: 'video', 'text', 'quiz', 'image'");
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }

  next();
};

export const validateUploadResource = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { fileName, fileUrl } = req.body;

  const errors: string[] = [];

  if (!fileName || typeof fileName !== 'string' || fileName.trim().length === 0) {
    errors.push('fileName is required and must be a non-empty string');
  }

  if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.trim().length === 0) {
    errors.push('fileUrl is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }

  next();
};

export const validatePublishCourse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { published } = req.body;

  if (published === undefined || typeof published !== 'boolean') {
    throw new ValidationError('published is required and must be a boolean');
  }

  next();
};
