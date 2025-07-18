import { Request, Response, NextFunction } from 'express';
import {
    CreatedResponse,
    OkResponse,
} from '../../utils/responses/SuccessResponse.js';
import z from 'zod';
import { createCustomShelfService } from './shelves-services.js';

// Update the TokenSchema with min(1) everywhere ?
const TokenSchema = z.string().min(1);

// Rename with the Prefix corresponding to the feature in every other controller files ?
const CreateCustomShelfSchema = z.object({
    name: z.string().min(1).max(100),
});

export async function createCustomShelfController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const shelf = CreateCustomShelfSchema.parse(req.body);

        // Don't forget to sanitize user input.
        await createCustomShelfService(tokenId, shelf.name);

        const response = new CreatedResponse(
            'Custom shelf have been created successfully.'
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
