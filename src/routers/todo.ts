import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { verifyToken } from '../functions/cookies.ts';
import auth from '../middleware/auth.ts';
import type TodoRepository from '../repositories/todo.ts';
import { validateTodo } from '../schemas/todo.ts';

dayjs.extend(utc);

export default ({ todoRepository }: { todoRepository: TodoRepository }) => {
    const router = express.Router();

    // Create new todo
    router.post('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todoID = uuidv4();
            const created = dayjs().utc().toISOString();

            let newTodo = validateTodo({
                ...req.body,
                todoID,
                userID: session.userID,
                created,
            });

            if (!newTodo) {
                return res.status(400).send({ error: 'Invalid field used.' });
            }

            let resultTodo = await todoRepository.insertOne(newTodo);
            return res.status(201).send(resultTodo);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ error: 'Todo creation failed.' });
        }
    });

    return router;
};
