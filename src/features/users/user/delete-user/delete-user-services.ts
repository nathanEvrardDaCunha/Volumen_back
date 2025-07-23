import {
    deleteUser,
    getUserById,
} from '../../../../models/users/users-models.js';
import { NotFoundError } from '../../../../utils/errors/ClientError.js';

export async function deleteUserService(userId: string): Promise<void> {
    const user = await getUserById(userId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    await deleteUser(user.id);
}
