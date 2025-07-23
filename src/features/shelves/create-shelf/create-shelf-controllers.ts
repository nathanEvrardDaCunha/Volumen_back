import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { createShelfService } from './create-shelf-services.js';
import { CreatedResponse } from '../../../utils/responses/SuccessResponse.js';
import { TokenSchema } from '../../../utils/schemas/global-schemas.js';

// Rename with the Prefix corresponding to the feature in every other controller files ?
const BodySchema = z.object({
    name: z.string().min(1).max(100),
});

export async function createShelfController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const shelf = BodySchema.parse(req.body);

        // Don't forget to sanitize user input.
        await createShelfService(tokenId, shelf.name);

        const response = new CreatedResponse(
            'Custom shelf have been created successfully.'
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
