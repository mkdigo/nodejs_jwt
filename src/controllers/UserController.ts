import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import ApiError from '../error/ApiError';
import AuthHelper from '../auth/AuthHelper';

const UserModel = new PrismaClient().user;
const ProfileModel = new PrismaClient().profile;

export default class UserController {
  public static async index(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const users = await UserModel.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      });

      return response.json({
        success: true,
        users: users,
      });
    } catch (err: any) {
      next(ApiError.internal(err.message));
    }
  }

  public static async withPosts(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const users = await UserModel.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
          posts: true,
        },
      });

      return response.json({
        success: true,
        users: users,
      });
    } catch (err: any) {
      next(ApiError.internal(err.message));
    }
  }

  public static async show(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const user = await UserModel.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
          posts: true,
        },
        where: {
          id: Number(id),
        },
      });

      if (!user) return next(ApiError.badRequest('User not found.'));

      return response.json({
        success: true,
        user,
      });
    } catch (err: any) {
      next(ApiError.internal(err.message));
    }
  }

  public static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email, name, username, password, bio, imageUrl } = request.body;

      const userExists = await UserModel.findUnique({
        where: {
          email,
        },
      });

      if (userExists) return next(ApiError.badRequest('User already exists.'));

      const salt = AuthHelper.makeSalt();
      const hash = AuthHelper.makeHash(password, salt);

      const user = await UserModel.create({
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          createdAt: true,
          profile: true,
        },
        data: {
          email,
          name,
          username,
          password: hash,
          salt,
        },
      });

      const profile = await ProfileModel.create({
        data: {
          bio,
          imageUrl,
          userId: user.id,
        },
      });

      user.profile = profile;

      return response.json({
        success: true,
        user: user,
      });
    } catch (err: any) {
      next(ApiError.internal(err.message));
    }
  }

  public static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const { email, name, username, bio, imageUrl } = request.body;

      const userExists = await UserModel.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!userExists) return next(ApiError.badRequest('User not found.'));

      const user = await UserModel.update({
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          profile: true,
        },
        where: {
          id: Number(id),
        },
        data: {
          email,
          name,
          username,
          profile: {
            update: {
              bio,
              imageUrl,
            },
          },
        },
      });

      return response.json({
        success: true,
        user: user,
      });
    } catch (err: any) {
      next(ApiError.internal(err.message));
    }
  }

  public static async destroy(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;

      const userExists = await UserModel.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!userExists) return next(ApiError.badRequest('User not found.'));

      const user = await UserModel.delete({
        where: {
          id: Number(id),
        },
      });

      return response.json({
        success: true,
        message: 'User deleted',
        user: user,
      });
    } catch (err: any) {
      next(ApiError.internal(err.message));
    }
  }
}
