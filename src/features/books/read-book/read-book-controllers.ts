import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { readBookService } from './read-book-services.js';

// Update the TokenSchema with min(1) everywhere ?
const TokenSchema = z.string().min(1);

// Rename with the Prefix corresponding to the feature in every other controller files ?
// Create a schema for every function receiving something in request (body, query...) specific only for their relevant function ?
const QuerySchema = z.string().min(1);

export async function readBookController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const queryTerms = QuerySchema.parse(req.query.book);

        // Don't forget to sanitize user input.
        const result = await readBookService(tokenId, queryTerms);

        const response = new OkResponse(
            'Books have been fetched successfully.',
            {
                books: result,
            }
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
