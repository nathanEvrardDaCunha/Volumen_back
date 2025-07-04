import { NextFunction, Request, Response } from 'express';
import { ClientError } from './ClientError.js';

// Check for Zod Error ?

export default function errorHandler(
    err: ClientError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(err);
    if (err instanceof ClientError) {
        res.status(err.httpCode).json({
            name: err.name,
            cause: err.cause,
            hint: err.hint,
            stack: err.stack,
        });
    } else {
        res.status(500).json({
            name: 'External Error',
            cause: err.message,
            hint: 'External error does not include hint.',
            stack: err.stack,
        });
    }
}
