import { BookType, BookSchema } from './books-schemas.js';
import { PoolClient } from 'pg';
import { pool } from '../../builds/db.js';

export async function getBookById(id: string): Promise<BookType | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            `SELECT 
                id, 
                self_link, 
                title, 
                authors, 
                subtitle, 
                description, 
                publisher, 
                published_date, 
                industry_identifiers, 
                page_count, 
                dimensions, 
                maturity_rating, 
                language, 
                preview_link, 
                info_link, 
                canonical_volume_link, 
                categories, 
                sale_country, 
                saleability, 
                is_ebook, 
                list_price, 
                retail_price, 
                buy_link
            FROM books WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const row = result.rows[0];

        const bookData = {
            id: row.id,
            selfLink: row.self_link || undefined,
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

        const book = BookSchema.parse(bookData);

        return book;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function createBook(book: BookType): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO books (
                id, 
                self_link, 
                title, 
                authors, 
                subtitle, 
                description, 
                publisher, 
                published_date, 
                industry_identifiers, 
                page_count, 
                dimensions, 
                maturity_rating, 
                language, 
                preview_link, 
                info_link, 
                canonical_volume_link, 
                categories, 
                sale_country, 
                saleability, 
                is_ebook, 
                list_price, 
                retail_price, 
                buy_link
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                $11, $12, $13, $14, $15, $16, $17, $18, $19, 
                $20, $21, $22, $23
            )`,
            [
                book.id,
                book.selfLink,
                book.volumeInfo.title,
                book.volumeInfo.authors,
                book.volumeInfo.subtitle,
                book.volumeInfo.description,
                book.volumeInfo.publisher,
                book.volumeInfo.publishedDate,
                book.volumeInfo.industryIdentifiers
                    ? JSON.stringify(book.volumeInfo.industryIdentifiers)
                    : null,
                book.volumeInfo.pageCount,
                book.volumeInfo.dimensions
                    ? JSON.stringify(book.volumeInfo.dimensions)
                    : null,
                book.volumeInfo.maturityRating,
                book.volumeInfo.language,
                book.volumeInfo.previewLink,
                book.volumeInfo.infoLink,
                book.volumeInfo.canonicalVolumeLink,
                book.volumeInfo.categories,
                book.saleInfo.country,
                book.saleInfo.saleability,
                book.saleInfo.isEbook,
                book.saleInfo.listPrice
                    ? JSON.stringify(book.saleInfo.listPrice)
                    : null,
                book.saleInfo.retailPrice
                    ? JSON.stringify(book.saleInfo.retailPrice)
                    : null,
                book.saleInfo.buyLink,
            ]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

//     id VARCHAR(64) PRIMARY KEY,
//     title TEXT NOT NULL,
//     author TEXT NOT NULL,
//     cover_url TEXT,
//     synopsis TEXT,
//     page_count INTEGER,
//     published_date DATE
