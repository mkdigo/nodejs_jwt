import express from 'express';

import apiErrorHandler from './error/api-error-handler';
import authMiddleware from './middlewares/authMiddleware';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRouter from './routes/postRoutes';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(authMiddleware);
app.use('/api/posts', postRouter);
app.use('/api/users', userRoutes);

app.use(apiErrorHandler);

app.listen(3333, () => console.log('Server running!'));
