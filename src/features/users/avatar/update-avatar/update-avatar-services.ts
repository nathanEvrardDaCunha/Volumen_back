import {
    getUserById,
    setAvatarByUserId,
} from '../../../../models/users/users-models.js';
import { NotFoundError } from '../../../../utils/errors/ClientError.js';

export async function updateAvatarService(
    tokenId: string,
    avatar_id: string
): Promise<void> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    await setAvatarByUserId(user.id, avatar_id);
}
