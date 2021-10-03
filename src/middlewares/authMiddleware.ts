import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const authHeader = req.headers['authorization'];

  // Bearer Token => [Bearer, Token]
  const token = authHeader?.split(' ')[1];

  if (!token || !accessTokenSecret) return next(ApiError.unauthorized());

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return next(ApiError.invalidToken());
    req.authUser = user as User;
    next();
  });
};

export default authMiddleware;
