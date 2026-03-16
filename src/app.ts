import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import connectDB from './functions/connectDB.ts';
import TodoRepository from './repositories/todo.ts';
import UserRepository from './repositories/user.ts';
import todoRouter from './routers/todo.ts';
import userRouter from './routers/user.ts';

const { FRONTEND_URL, PORT, TODOX_DB_NAME } = process.env;

const app = express();
app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);

// Connect database
const todoxDB = await connectDB(TODOX_DB_NAME!);
const todoRepository = new TodoRepository(todoxDB);
const userRepository = new UserRepository(todoxDB);

// Initialize routers
app.use('/health', (_req, res) => {
    res.status(200).send('Ok');
});
app.use('/todo', todoRouter({ todoRepository }));
app.use('/user', userRouter({ userRepository }));

app.listen(PORT, () => {
    console.log(`TodoX API listening at http://localhost:${PORT}`);
});
