import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../../utils/responses/SuccessResponse.js';
import { fetchAvatarService } from './fetch-avatar-service.js';

const TokenSchema = z.string();

export async function fetchAvatarController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);

        // Don't forget to sanitize user input.
        const result = await fetchAvatarService(tokenId);

        const response = new OkResponse(
            'Avatar has been fetched successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
