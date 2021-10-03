import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import ApiError from '../error/ApiError';
import AuthHelper from '../auth/AuthHelper';

const userModel = new PrismaClient().user;

const authRoutes = Router();

authRoutes.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    // Authenticate User
    const { username, password } = req.body;

    const user = await userModel.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        salt: true,
        password: true,
      },
      where: {
        username,
      },
    });

    const hash = AuthHelper.makeHash(password, user?.salt ?? '');

    if (!user || user.password !== hash)
      return next(ApiError.badRequest('Username or password invalid.'));

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret)
      return next(
        ApiError.badRequest('You need setup the access token secret.')
      );

    const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '1m' });

    return res.json({
      success: true,
      accessToken,
    });
  }
);

export default authRoutes;
