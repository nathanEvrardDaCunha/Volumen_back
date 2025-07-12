import { Request, Response, NextFunction } from 'express';
import {
    deleteUserService,
    fetchAvatarService,
    fetchUserService,
    logoutService,
    updateAvatarService,
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

const UpdateAvatarSchema = z.object({
    avatar_id: z.enum(
        [
            'abstract-red.jpg',
            'abstract-blue-orange.jpg',
            'abstract-blue-waves.jpg',
            'abstract-dark-blue.jpg',
            'abstract-purple-cut.jpg',
            'abstract-white-waves.jpg',
            'abstract-white-cuts.jpg',
            'blue-galaxy.jpg',
            'bright-stars.jpg',
            'deers-and-mountains.jpg',
            'flowers-in-pastures.jpg',
            'mountains-topdown.jpg',
            'purple-cosmos.jpg',
            'red-mushroom.jpg',
            'single-rose-flower.jpg',
            'water-cascading-down.jpg',
            'white-daisy.jpg',
            'wood-and-mist.jpg',
        ],
        {
            message: 'Invalid avatar. Please, select one from the list.',
        }
    ),
});
export type UpdateAvatarType = z.infer<typeof UpdateAvatarSchema>;

export async function updateAvatarController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // For every controller service, add here a console.log "Started doing X controller"

        const tokenId = TokenSchema.parse(req.id);
        const { avatar_id } = UpdateAvatarSchema.parse(req.body);

        await updateAvatarService(tokenId, avatar_id);

        const response = new OkResponse(
            'Avatar has been updated successfully.',
            {
                data: null,
            }
        );

        // For every controller service, add here a console.log "Ended doing X controller successfully"

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
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
