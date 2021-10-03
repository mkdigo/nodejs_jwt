import { Router } from 'express';

import UserController from '../controllers/UserController';

const userRouter = Router();

userRouter.get('/', UserController.index);
userRouter.get('/with-posts', UserController.withPosts);
userRouter.post('/', UserController.create);
userRouter.get('/:id', UserController.show);
userRouter.put('/:id', UserController.update);
userRouter.delete('/:id', UserController.destroy);

export default userRouter;
