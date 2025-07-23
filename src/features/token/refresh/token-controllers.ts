import { Request, Response, NextFunction } from 'express';
import { refreshTokenService } from './token-services.js';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import z from 'zod';

const CookiesSchema = z.object({
    refreshToken: z.string(),
});

export async function refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = CookiesSchema.parse(req.cookies);

        const result = await refreshTokenService(refreshToken);

        const response = new OkResponse(
            'Access token ahs been updated successfully.',
            {
                accessToken: result,
            }
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
