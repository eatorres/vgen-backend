import type { Request, Response, NextFunction } from 'express';

import { validateToken } from '../functions/cookies.ts';

// Middleware used to confirm the user has a valid session cookie and is thus, signed in
const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['todox-session'];
        if (sessionToken) {
            if (validateToken(sessionToken)) {
                return next();
            }
        }

        return res.status(401).send({});
    } catch (err) {
        return res.status(401).send({});
    }
};

export default auth;
