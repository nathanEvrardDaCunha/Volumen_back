import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { logoutService } from './logout-services.js';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';

const CookiesSchema = z.object({
    refreshToken: z.string(),
});

export async function logoutUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = CookiesSchema.parse(req.cookies);

        await logoutService(refreshToken);

        const response = new OkResponse(
            'User has been disconnected successfully.',
            { data: null }
        );

        res.clearCookie('refreshToken', {
            httpOnly: true,
            maxAge: 0,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
