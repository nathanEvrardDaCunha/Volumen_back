import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { readShelvesService } from './read-shelves-services.js';

// Update the TokenSchema with min(1) everywhere ?
const TokenSchema = z.string().min(1);

// Rename with the Prefix corresponding to the feature in every other controller files ?
const BodySchema = z.object({
    name: z.string().min(1).max(100),
});

// Are every response returning value like this: {data: something} ?
// => If not, need to make update the relevant codebase part to be more consistent
export async function readShelvesController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);

        // Don't forget to sanitize user input.
        const result = await readShelvesService(tokenId);

        const response = new OkResponse(
            'Shelves have been fetched successfully.',
            { data: result }
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
