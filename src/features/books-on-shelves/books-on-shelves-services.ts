import { getBooksFromShelf } from '../../models/books-on-shelves/books-on-shelves-models.js';
import { Book } from '../../models/books/books-schemas.js';
import { fetchShelvesByUserId } from '../../models/shelves/shelves-models.js';
import { ShelveType } from '../../models/shelves/shelves-schemas.js';
import { getUserById } from '../../models/users/users-models.js';
import { NotFoundError } from '../../utils/errors/ClientError.js';

// Is it a good Idea to move every schema in the "service" file they belong to and duplicate it if necessary to create HcLC code ?

// Define the shelf type without the excluded fields
type ShelfWithoutMetadata = Omit<
    ShelveType,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

type BooksFromUserShelvesType = {
    shelf: ShelfWithoutMetadata;
    books: Book[] | false;
};

export async function fetchBooksFromUserShelvesService(
    tokenId: string
): Promise<BooksFromUserShelvesType[]> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const userShelves = await fetchShelvesByUserId(user.id);

    const booksShelves = await Promise.all(
        userShelves.map(async (shelf) => {
            const result = await getBooksFromShelf(shelf.id);

            const { id, userId, createdAt, updatedAt, ...newShelf } = shelf;
            const finalShelf: BooksFromUserShelvesType = {
                shelf: newShelf,
                books: result,
            };
            return finalShelf;
        })
    );

    return booksShelves;
}
