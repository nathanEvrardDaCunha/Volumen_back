import { z } from 'zod';
import {
    Book,
    BookItem,
    BookItemSchema,
    BookSchema,
} from '../../models/books/books-schemas.js';
import GOOGLE from './google-book-constants.js';

const GoogleBookResponseSchema = z.object({
    items: z.array(BookItemSchema),
});

function validateBook(item: BookItem): Book {
    return BookSchema.parse(item);
}

function processGoogleBooksResponse(response: unknown): Book[] {
    try {
        const validatedResponse = GoogleBookResponseSchema.parse(response);

        const books: Book[] = validatedResponse.items.map(validateBook);

        return books;
    } catch (error) {
        console.error('Validation error:', error);
        throw new Error('Invalid Google Books API response format');
    }
}

export async function fetchGoogleBookByQuery(
    queryTerm: string
): Promise<Book[]> {
    const url = new URL('https://www.googleapis.com/books/v1/volumes');
    url.searchParams.append('q', queryTerm);
    url.searchParams.append('key', GOOGLE);

    // Do I need to implement a try/catch even though I wish for the error to bubble
    // up to be caught by my custom middleware ?
    const result = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    // console.log('Response status:', result.status);
    // console.log('Response headers:', result.headers);

    // Create an custom API Error ?
    if (!result.ok) {
        const errorText = await result.text();
        console.error('API Error:', errorText);
        throw new Error(
            `Google Books API error: ${result.status} ${result.statusText}`
        );
    }

    // Add "AccessInfo" for embeddable preview ?
    const data = await result.json();
    const books = processGoogleBooksResponse(data);

    return books;
}
