import { Request, Response, NextFunction } from 'express';
import ApiError from './ApiError';

export default function apiErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'something went wrong',
  });
}
