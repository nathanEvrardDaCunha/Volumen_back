import {
    createShelfByUserId,
    getShelfByUserId,
} from '../../../models/shelves/shelves-models.js';
import { getUserById } from '../../../models/users/users-models.js';
import {
    ConflictError,
    NotFoundError,
} from '../../../utils/errors/ClientError.js';

export async function createShelfService(
    tokenId: string,
    shelfData: string
): Promise<void> {
    // rename "getUserBydId" to something more SQL like "selectUserById" ?
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    // rename "getShelfBydUserId" to something more SQL like "selectShelfByUserId" ?
    const shelf = await getShelfByUserId(user.id, shelfData);
    if (shelf) {
        throw new ConflictError(
            `Shelf ${shelfData} already exist in user database.`
        );
    }

    await createShelfByUserId(user.id, shelfData);
}
