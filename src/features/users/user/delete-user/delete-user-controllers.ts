import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../../../utils/responses/SuccessResponse.js';
import { deleteUserService } from './delete-user-services.js';
import { TokenSchema } from '../../../../utils/schemas/global-schemas.js';

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
