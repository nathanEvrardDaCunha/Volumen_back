import { PoolClient } from 'pg';
import { pool } from '../../builds/db.js';
import { Book } from '../books/book-schema.js';
import { ShelveType } from '../shelves/shelves-schemas.js';
import {
    BookOnShelfSchema,
    BookOnShelfType,
} from './books-on-shelves-schemas.js';

// I should rewrite the name of every file missing the "s" from it's parent folder
// E.g: "book-schema.ts" in "books" should be "books-schema.ts" for consistency reasons.

export async function getBookToShelve(
    bookId: string,
    shelveId: string
): Promise<BookOnShelfType | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            `SELECT 
                shelf_id, book_id, added_at
            FROM books_on_shelves WHERE book_id = $1 AND shelf_id = $2`,
            [bookId, shelveId]
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

// Correct the grammatical mistake of "shelve" (singular) to "shelf"
export async function linkBookToShelve(
    book: Book,
    shelve: ShelveType
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO books_on_shelves (book_id, shelf_id) VALUES ($1, $2)`,
            [book.id, shelve.id]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}
