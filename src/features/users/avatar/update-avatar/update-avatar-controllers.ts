import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { OkResponse } from '../../../../utils/responses/SuccessResponse.js';
import { updateAvatarService } from './update-avatar-services.js';

const TokenSchema = z.string();

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
