import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { CreatedResponse } from '../../../utils/responses/SuccessResponse.js';
import { registerService } from './register-service.js';

const RegisterSchema = z.object({
    username: z.string().min(5),
    email: z.string().email(),
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
        }),
});

// Don't forget to sanitize user input.
export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { username, email, password } = RegisterSchema.parse(req.body);

        await registerService(username, email, password);

        const response = new CreatedResponse(
            'User has been created successfully.'
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
