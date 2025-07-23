import { fetchShelvesByUserId } from '../../../models/shelves/shelves-models.js';
import { ShelfType } from '../../../models/shelves/shelves-schemas.js';
import { getUserById } from '../../../models/users/users-models.js';
import { NotFoundError } from '../../../utils/errors/ClientError.js';

type ClientShelvesType = Omit<
    ShelfType,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export async function readShelvesService(
    tokenId: string
): Promise<ClientShelvesType[]> {
    // rename "getUserBydId" to something more SQL like "selectUserById" ?
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    // rename "fetchShelvesByUserId" to something more SQL like "selectShelvesByUserId" ?
    const shelves = await fetchShelvesByUserId(user.id);
    const newShelves = shelves.map((shelf) => {
        const { id, userId, createdAt, updatedAt, ...newShelf } = shelf;
        return newShelf;
    });

    return newShelves;
}
