import {
    createCustomShelveByUserId,
    fetchShelvesByUserId,
    getShelfByUserId,
} from '../../models/shelves/shelve-model.js';
import { ShelveType } from '../../models/shelves/shelves-schemas.js';
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

    const shelf = await getShelfByUserId(user.id, shelfData);
    if (shelf) {
        throw new ConflictError(
            `Shelf ${shelfData} already exist in user database.`
        );
    }

    await createCustomShelveByUserId(user.id, shelfData);
}

type ClientShelvesType = Omit<
    ShelveType,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export async function fetchShelvesServices(
    tokenId: string
): Promise<ClientShelvesType[]> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const shelves = await fetchShelvesByUserId(user.id);
    const newShelves = shelves.map((shelf) => {
        const { id, userId, createdAt, updatedAt, ...newShelf } = shelf;
        return newShelf;
    });

    return newShelves;
}
