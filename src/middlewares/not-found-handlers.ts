import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors/ClientError.js';

export default function notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const error = new NotFoundError(
        `Route not found for ${req.method} ${req.originalUrl}`
    );

    next(error);
}
