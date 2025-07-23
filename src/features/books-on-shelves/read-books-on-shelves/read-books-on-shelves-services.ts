import { getBooksFromShelf } from '../../../models/books-on-shelves/books-on-shelves-models.js';
import { BookType } from '../../../models/books/books-schemas.js';
import { fetchShelvesByUserId } from '../../../models/shelves/shelves-models.js';
import { ShelfType } from '../../../models/shelves/shelves-schemas.js';
import { getUserById } from '../../../models/users/users-models.js';
import { NotFoundError } from '../../../utils/errors/ClientError.js';

// Is it a good Idea to move every schema in the "service" file they belong to and duplicate it if necessary to create HcLC code ?

// Define the shelf type without the excluded fields
type ShelfWithoutMetadataType = Omit<
    ShelfType,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

// Move "BooksOnShelvesType" in the books-on-shelves-schema.ts file ?
// => If yes, same for "ShelfWithoutMetadataType" ?
type BooksOnShelvesType = {
    shelf: ShelfWithoutMetadataType;
    books: BookType[] | false;
};

//
// For every SQL SELECT function: "selectSomethingFromSomethingBySomething" ?
//
// Could do something similar for INSERT, UPDATE...
//

export async function readBooksOnShelvesService(
    tokenId: string
): Promise<BooksOnShelvesType[]> {
    // rename "getUserBydId" to something more SQL like "selectUserById" ?
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    // rename "fetchShelvesByUserId" to something more SQL like "selectShelvesByUserId" ?
    const userShelves = await fetchShelvesByUserId(user.id);

    const booksShelves = await Promise.all(
        userShelves.map(async (shelf) => {
            // rename "getBooksFromShelf" to something more SQL like "selectBooksFromShelfByShelfId" ?
            const result = await getBooksFromShelf(shelf.id);

            const { id, userId, createdAt, updatedAt, ...newShelf } = shelf;
            const finalShelf: BooksOnShelvesType = {
                shelf: newShelf,
                books: result,
            };
            return finalShelf;
        })
    );

    return booksShelves;
}
