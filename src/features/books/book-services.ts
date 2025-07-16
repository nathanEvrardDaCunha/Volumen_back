import {
    getBookToShelve,
    linkBookToShelve,
} from '../../models/books-on-shelves/books-on-shelves-models.js';
import { createBook, getBookById } from '../../models/books/book-model.js';
import { Book } from '../../models/books/book-schema.js';
import { getShelveByUserId } from '../../models/shelves/shelve-model.js';
import { getUserById } from '../../models/users/user-models.js';
import { NotFoundError } from '../../utils/errors/ClientError.js';
import { fetchGoogleBookByQuery } from './book-api.js';

export async function fetchBookService(
    tokenId: string,
    queryTerm: string
): Promise<Book[]> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const books = await fetchGoogleBookByQuery(queryTerm);

    return books;
}

export async function saveBookService(
    tokenId: string,
    bookData: Book
): Promise<void> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const book = await getBookById(bookData.id);
    if (!book) {
        await createBook(bookData);
    }

    const shelve = await getShelveByUserId(user.id, 'Want to Read');
    if (!shelve) {
        throw new NotFoundError(
            `User shelves ${'Want to Read'} has not been found in database.`
        );
    }

    const link = await getBookToShelve(bookData.id, shelve.id);
    if (!link) {
        await linkBookToShelve(bookData, shelve);
    }
}
