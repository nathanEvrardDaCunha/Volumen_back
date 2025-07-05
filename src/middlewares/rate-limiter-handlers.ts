import { rateLimit } from 'express-rate-limit';
import { type Request, type Response, type NextFunction } from 'express';
import { TooManyRequestsError } from '../utils/errors/ClientError.js';

const MINUTES = 5;
const SECONDS = 60;
const MILLISECONDS = 1000;
const MAX_REQUEST = 100;

const rateHandler = rateLimit({
    windowMs: MINUTES * SECONDS * MILLISECONDS,
    max: MAX_REQUEST,
    message:
        'Server has temporarily blocked your IP due too many request. Please try again after waiting 5 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction, options) => {
        const error = new TooManyRequestsError(
            'Server has temporarily blocked your IP due too many request.',
            'Please try again after waiting 5 minutes.'
        );
        next(error);
    },
});

export default rateHandler;
