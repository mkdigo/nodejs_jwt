import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import ApiError from '../error/ApiError';

const PostModel = new PrismaClient().post;

export default class PostController {
  public static async index(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const posts = await PostModel.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          author: true,
        },
      });

      return response.json({
        success: true,
        posts,
      });
    } catch (err: any) {
      return next(ApiError.internal(err.message));
    }
  }

  public static async show(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;

      const post = await PostModel.findFirst({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: true,
        },
        where: {
          id: Number(id),
        },
      });

      return response.json({
        success: true,
        post,
      });
    } catch (err: any) {
      return next(ApiError.internal(err.message));
    }
  }

  public static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { userId, title, content } = request.body;

      const post = await PostModel.create({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: true,
        },
        data: {
          title,
          content,
          authorId: userId,
        },
      });

      return response.json({
        success: true,
        post,
      });
    } catch (err: any) {
      return next(ApiError.internal(err.message));
    }
  }
}
