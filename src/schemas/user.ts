import * as z from 'zod/v4';

import { createValidator } from './createValidator.ts';

export const UserSchema = z
    .object({
        userID: z.string(),
        username: z.string(),
        password: z.string(),
        created: z.iso.datetime(),
    })
    .meta({ description: 'User' });

export type User = z.infer<typeof UserSchema>;

export const validateUser = createValidator(UserSchema);
