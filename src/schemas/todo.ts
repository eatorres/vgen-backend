import * as z from 'zod/v4';

import { createValidator } from './createValidator.ts';

export const TodoSchema = z
    .object({
        todoID: z.string(),
        userID: z.string(),
        name: z.string(),
        status: z.enum(['incomplete', 'completed']),
        created: z.iso.datetime(),
    })
    .meta({ description: 'Todo' });

export type Todo = z.infer<typeof TodoSchema>;

export const validateTodo = createValidator(TodoSchema);
