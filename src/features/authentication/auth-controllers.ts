import { Request, Response, NextFunction } from 'express';
import { loginService, registerService } from './auth-services.js';
import { CreatedResponse } from '../../utils/responses/SuccessResponse.js';
import z from 'zod';

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

const LoginSchema = z.object({
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
export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email, password } = LoginSchema.parse(req.body);

        const result = await loginService(email, password);

        const response = new CreatedResponse(
            'User has been authenticated successfully.',
            {
                accessToken: result.accessToken,
            }
        );

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
