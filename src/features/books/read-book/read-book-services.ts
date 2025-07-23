import { Book } from '../../../models/books/books-schemas.js';
import { getUserById } from '../../../models/users/users-models.js';
import { NotFoundError } from '../../../utils/errors/ClientError.js';
import { fetchGoogleBookByQuery } from '../book-api.js';

export async function readBookService(
    tokenId: string,
    queryTerm: string
): Promise<Book[]> {
    // rename "getUserBydId" to something more SQL like "selectUserById" ?
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    // rename the "fetchGoogleBookQuery" ?
    const books = await fetchGoogleBookByQuery(queryTerm);

    return books;
}
