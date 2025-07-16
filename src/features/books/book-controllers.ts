import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../utils/responses/SuccessResponse.js';
import z from 'zod';
import { fetchBookService, saveBookService } from './book-services.js';
import { BookSchema } from '../../models/books/book-schema.js';

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

export async function saveBookController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const bookData = BookSchema.parse(req.body);

        // Don't forget to sanitize user input.
        await saveBookService(tokenId, bookData);

        const response = new OkResponse(
            'Books have been fetched successfully.'
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
