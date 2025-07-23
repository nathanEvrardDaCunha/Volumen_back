import { PoolClient } from 'pg';
import { pool } from '../../builds/db.js';
import { BookType, BookSchema } from '../books/books-schemas.js';
import { ShelfType } from '../shelves/shelves-schemas.js';
import {
    BookOnShelfSchema,
    BookOnShelfType,
} from './books-on-shelves-schemas.js';

// I should rewrite the name of every file missing the "s" from it's parent folder
// E.g: "book-schema.ts" in "books" should be "books-schema.ts" for consistency reasons.

// Here it's not a inner join but is called getBookFromSHelf, but the one below is an inner join with basically the same name
export async function getBookFromShelf(
    bookId: string,
    ShelfId: string
): Promise<BookOnShelfType | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            `SELECT 
                shelf_id, book_id, added_at
            FROM books_on_shelves WHERE book_id = $1 AND shelf_id = $2`,
            [bookId, ShelfId]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const row = result.rows[0];

        const bookOnShelfData = {
            shelfId: row.shelf_id,
            bookId: row.book_id,
            addedAt: row.added_at,
        };

        const bookOnShelf = BookOnShelfSchema.parse(bookOnShelfData);

        return bookOnShelf;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getBooksFromShelf(
    ShelfId: string
): Promise<BookType[] | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            `SELECT 
                books.id, 
                books.self_link, 
                books.title, 
                books.authors, 
                books.subtitle, 
                books.description, 
                books.publisher, 
                books.published_date, 
                books.industry_identifiers, 
                books.page_count, 
                books.dimensions, 
                books.maturity_rating, 
                books.language, 
                books.preview_link, 
                books.info_link, 
                books.canonical_volume_link, 
                books.categories, 
                books.sale_country, 
                books.saleability, 
                books.is_ebook, 
                books.list_price, 
                books.retail_price, 
                books.buy_link
            FROM books_on_shelves
            INNER JOIN books ON books_on_shelves.book_id = books.id
            WHERE books_on_shelves.shelf_id = $1`,
            [ShelfId]
        );

        if (result.rows.length === 0) {
            return false;
        }

        // when parsing, instead of returning hardcoded value, make it return a type ?
        // example: book is BookType and not { id... }
        const books = result.rows.map((row: any) => {
            const bookData = {
                id: row.id,
                selfLink: row.self_link,
                volumeInfo: {
                    title: row.title || undefined,
                    authors: row.authors || undefined,
                    subtitle: row.subtitle || undefined,
                    description: row.description || undefined,
                    publisher: row.publisher || undefined,
                    publishedDate: row.published_date || undefined,
                    industryIdentifiers: row.industry_identifiers || undefined,
                    pageCount: row.page_count || undefined,
                    dimensions: row.dimensions || undefined,
                    maturityRating: row.maturity_rating || undefined,
                    language: row.language || undefined,
                    previewLink: row.preview_link || undefined,
                    infoLink: row.info_link || undefined,
                    canonicalVolumeLink: row.canonical_volume_link || undefined,
                    categories: row.categories || undefined,
                },
                saleInfo: {
                    country: row.sale_country || undefined,
                    saleability: row.saleability || undefined,
                    isEbook: row.is_ebook || undefined,
                    listPrice: row.list_price || undefined,
                    retailPrice: row.retail_price || undefined,
                    buyLink: row.buy_link || undefined,
                },
            };

            return BookSchema.parse(bookData);
        });

        return books;
    } finally {
        if (client) {
            client.release();
        }
    }
}

// Correct the grammatical mistake of "shelve" (singular) to "shelf"
export async function linkBookToShelve(
    bookId: string,
    shelfId: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO books_on_shelves (book_id, shelf_id) VALUES ($1, $2)`,
            [bookId, shelfId]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}
