import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../utils/responses/SuccessResponse.js';
import z from 'zod';
import { fetchBookService } from './book-services.js';

// Update the TokenSchema with min(1) everywhere ?
const TokenSchema = z.string().min(1);

// Rename with the Prefix corresponding to the feature in every other controller files ?
const FetchBookQueryTerm = z.string().min(1);

export async function fetchBookController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const queryTerms = FetchBookQueryTerm.parse(req.query.book);

        // Don't forget to sanitize user input.
        const result = await fetchBookService(tokenId, queryTerms);

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
