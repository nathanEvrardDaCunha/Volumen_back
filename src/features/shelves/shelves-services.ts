import {
    createCustomShelveByUserId,
    getShelveByUserId,
} from '../../models/shelves/shelve-model.js';
import { getUserById } from '../../models/users/user-models.js';
import {
    ConflictError,
    NotFoundError,
} from '../../utils/errors/ClientError.js';

export async function createCustomShelfService(
    tokenId: string,
    shelfData: string
): Promise<void> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const shelf = await getShelveByUserId(user.id, shelfData);
    if (shelf) {
        throw new ConflictError(
            `Shelf ${shelfData} already exist in user database.`
        );
    }

    await createCustomShelveByUserId(user.id, shelfData);
}
