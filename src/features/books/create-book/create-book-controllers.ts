import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { BookSchema } from '../../../models/books/books-schemas.js';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { createBookService } from './create-book-services.js';

// Update the TokenSchema with min(1) everywhere ?
const TokenSchema = z.string().min(1);

// Rename with the Prefix corresponding to the feature in every other controller files ?
// Create a schema for every function receiving something in request (body, query...) specific only for their relevant function ?
const BodySchema = BookSchema;

// Duplicate and move each schema either into specific file or relate them to their specific function controller
export async function createBookController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const bookData = BodySchema.parse(req.body);

        // Don't forget to sanitize user input.
        await createBookService(tokenId, bookData);

        const response = new OkResponse('Book has been fetched successfully.');

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
