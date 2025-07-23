import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../../utils/responses/SuccessResponse.js';
import { fetchUserService } from './fetch-user-services.js';

// Should extract this validation to be more global ?
const TokenSchema = z.string();

export async function fetchUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);

        // Don't forget to sanitize user input.
        const result = await fetchUserService(tokenId);

        const response = new OkResponse(
            'User has been fetched successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
