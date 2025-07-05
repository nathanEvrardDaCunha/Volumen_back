import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import z from 'zod';
import JWT from '../constants/jwt-constants.js';
import { UnauthorizedError } from '../utils/errors/ClientError.js';

declare module 'express-serve-static-core' {
    interface Request {
        id?: string;
    }
}

const AccessTokenSchema = z.string().min(5);

const DecodedSchema = z.object({
    id: z.string().uuid(),
});

export default function tokenHandler(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        throw new UnauthorizedError('Authentication header is undefined !');
    }

    const accessToken = authorizationHeader.split(' ')[1];
    const newAccessToken = AccessTokenSchema.parse(accessToken);

    jwt.verify(
        newAccessToken,
        JWT.access_token,
        (
            err: jwt.VerifyErrors | null,
            decoded: string | JwtPayload | undefined
        ) => {
            if (err) {
                throw new UnauthorizedError('Access token is invalid !');
            }

            const result = DecodedSchema.safeParse(decoded);
            if (!result.success) {
                console.error(
                    'Decoded JWT payload validation failed:',
                    result.error.errors
                );
                throw new UnauthorizedError('Decoded JWT payload is invalid!');
            }

            req.id = result.data.id;
            next();
        }
    );
}
