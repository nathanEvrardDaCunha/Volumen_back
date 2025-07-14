import { getUserById } from '../../models/user-models.js';
import { NotFoundError } from '../../utils/errors/ClientError.js';
import { Book, fetchGoogleBookByQuery } from './book-api.js';

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
