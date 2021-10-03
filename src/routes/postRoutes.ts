import { Router } from 'express';
import PostController from '../controllers/PostController';

const postRouter = Router();

postRouter.get('/', PostController.index);
postRouter.post('/', PostController.create);

export default postRouter;
