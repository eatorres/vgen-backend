import type { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';

interface SessionTokenPayload {
    userID: string;
    sessionStarted: number;
}

export const setSessionCookie = (res: Response, { userID, sessionStarted }: Partial<SessionTokenPayload>) => {
    const { COOKIE_LIFETIME, COOKIE_DOMAIN } = process.env;

    const options: CookieOptions = {
        // COOKIE_LIFETIME is in days, convert it to ms
        maxAge: COOKIE_LIFETIME ? parseInt(COOKIE_LIFETIME) * 24 * 60 * 60 * 1000 : undefined,
        secure: true,
    };

    if (COOKIE_DOMAIN) {
        options.domain = COOKIE_DOMAIN;
    }

    res.cookie('todox-session', generateSessionToken({ userID, sessionStarted }), options);
};

export const deleteCookies = (res: Response) => {
    const { COOKIE_DOMAIN } = process.env;

    const options: CookieOptions = {
        secure: true,
    };
    if (COOKIE_DOMAIN) {
        options.domain = COOKIE_DOMAIN;
    }

    res.clearCookie('todox-session', options);
};

export const decodeToken = (token: string) => {
    return jwt.decode(token);
};

export const verifyToken = (token: string, options = {}): SessionTokenPayload => {
    const { TOKEN_SECRET } = process.env;
    return jwt.verify(token, TOKEN_SECRET!, options) as SessionTokenPayload;
};

export const validateToken = (token: string, options = {}) => {
    const { TOKEN_SECRET } = process.env;
    if (jwt.verify(token, TOKEN_SECRET!, options)) {
        return true;
    } else {
        return false;
    }
};

export const generateSessionToken = ({ userID, sessionStarted }: Partial<SessionTokenPayload>) => {
    const { COOKIE_LIFETIME, TOKEN_SECRET } = process.env;
    return jwt.sign(
        {
            userID,
            sessionStarted: sessionStarted ? sessionStarted : Date.now(),
        },
        TOKEN_SECRET!,
        { expiresIn: `${COOKIE_LIFETIME}d` },
    );
};
