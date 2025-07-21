import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../utils/responses/SuccessResponse.js';
import z from 'zod';
import { fetchBooksFromUserShelvesService } from './books-on-shelves-services.js';

const TokenSchema = z.string().min(1);

export async function fetchBooksFromUserShelvesController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);

        // Don't forget to sanitize user input.
        const result = await fetchBooksFromUserShelvesService(tokenId);

        const response = new OkResponse(
            'Books from User Shelves and Shelves have been fetched successfully.',
            { data: result }
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
