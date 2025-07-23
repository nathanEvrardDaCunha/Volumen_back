import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../../utils/responses/SuccessResponse.js';
import { updateUserService } from './update-user-services.js';
import { TokenSchema } from '../../../../utils/schemas/global-schemas.js';

const BodySchema = z.object({
    username: z.string().min(5).optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    password: z
        .string()
        .min(8)
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine((password) => /[a-z]/.test(password), {
            message: 'Password must contain at least one lowercase letter',
        })
        .refine((password) => /[0-9]/.test(password), {
            message: 'Password must contain at least one number',
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: 'Password must contain at least one special character',
        })
        .optional()
        .or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
});

export async function updateUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);
        const { username, email, password, bio } = BodySchema.parse(req.body);

        await updateUserService(tokenId, username, email, password, bio);

        const response = new OkResponse('User has been updated successfully.', {
            data: null,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
