import {
    getBookFromShelf,
    linkBookToShelve,
} from '../../../models/books-on-shelves/books-on-shelves-models.js';
import { createBook, getBookById } from '../../../models/books/books-models.js';
import { BookType } from '../../../models/books/books-schemas.js';
import { getShelfByUserId } from '../../../models/shelves/shelves-models.js';
import { getUserById } from '../../../models/users/users-models.js';
import { NotFoundError } from '../../../utils/errors/ClientError.js';

export async function createBookService(
    tokenId: string,
    bookData: BookType
): Promise<void> {
    // rename "getUserBydId" to something more SQL like "selectUserById" ?
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    // rename "getBookBydId" to something more SQL like "selectBookById" ?
    let book = await getBookById(bookData.id);
    if (!book) {
        // rename "createBook" to something more SQL like "insertBookInDB" ?
        await createBook(bookData);
        book = bookData;
    }

    // rename "getShelfBydUserId" to something more SQL like "selectShelfByUserId" ?
    const shelf = await getShelfByUserId(user.id, 'Want to Read');
    if (!shelf) {
        throw new NotFoundError(
            `User shelves ${'Want to Read'} has not been found in database.`
        );
    }

    // rename "getBookFromShelf" to something more SQL like "selectBookOnShelfByBookAndShelfID" ?
    const link = await getBookFromShelf(bookData.id, shelf.id);
    if (!link) {
        // rename "linkBookToShelve" to something more SQL like "selectBookOnShelfByBookAndShelfID" ?
        await linkBookToShelve(book.id, shelf.id);
    }
}
