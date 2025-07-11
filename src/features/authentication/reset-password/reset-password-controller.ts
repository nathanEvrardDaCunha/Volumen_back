import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { resetPasswordService } from './reset-password-service.js';

const ResetPasswordSchema = z.object({
    email: z.string().email(),
});

export async function resetPasswordController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email } = ResetPasswordSchema.parse(req.body);

        await resetPasswordService(email);

        const response = new OkResponse(
            'User email received new password successfully.',
            { data: null }
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
