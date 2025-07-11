import { Request, Response, NextFunction } from 'express';
import {
    deleteUserService,
    fetchUserService,
    logoutService,
    updateUserService,
} from './user-services.js';
import { OkResponse } from '../../utils/responses/SuccessResponse.js';
import z from 'zod';

// Should divide this files into respective controllers-services just like "authentication"

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

const UpdateUserFormSchema = z.object({
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
        const { username, email, password, bio } = UpdateUserFormSchema.parse(
            req.body
        );

        await updateUserService(tokenId, username, email, password, bio);

        const response = new OkResponse('User has been updated successfully.', {
            data: null,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

const RefreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export async function logoutUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = RefreshTokenSchema.parse(req.cookies);

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

export async function deleteUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);

        await deleteUserService(tokenId);

        const response = new OkResponse('User has been deleted successfully.', {
            data: null,
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            maxAge: 0,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
