import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { verifyToken } from '../functions/cookies.ts';
import auth from '../middleware/auth.ts';
import type TodoRepository from '../repositories/todo.ts';
import type { Todo } from '../schemas/todo.ts';
import { validatePatchTodo, validateTodo } from '../schemas/todo.ts';

dayjs.extend(utc);

export default ({ todoRepository }: { todoRepository: TodoRepository }) => {
    const router = express.Router();

    // List todos for the signed-in user
    router.get('/', auth, async (req, res) => {
        try {
            const session = verifyToken(req.cookies['todox-session']);
            const todos = await todoRepository.findByUserId(session.userID);
            return res.status(200).send(todos);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ error: 'Failed to fetch todos.' });
        }
    });

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

    // Patch todo (partial: status or name)
    router.patch('/:todoID', auth, async (req, res) => {
        try {
            const session = verifyToken(req.cookies['todox-session']);
            const parsed = validatePatchTodo(req.body);
            if (!parsed) {
                return res.status(400).send({ error: 'Invalid field used.' });
            }

            const todoIDParam = req.params['todoID'];
            const todoID = Array.isArray(todoIDParam) ? todoIDParam[0] : todoIDParam;

            const patch: Partial<Pick<Todo, 'status' | 'name'>> = {};
            if (parsed.status !== undefined) patch.status = parsed.status;
            if (parsed.name !== undefined) patch.name = parsed.name;

            const updated = await todoRepository.updateById(
                todoID,
                session.userID,
                patch,
            );

            if (!updated) {
                return res.status(404).send({ error: 'Todo not found.' });
            }

            return res.status(200).send(updated);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ error: 'Todo update failed.' });
        }
    });

    return router;
};
