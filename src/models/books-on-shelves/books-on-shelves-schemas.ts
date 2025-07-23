import { z } from 'zod';
import { BookSchema } from '../books/books-schemas.js';
import { ShelfSchema } from '../shelves/shelves-schemas.js';

export const BookOnShelfSchema = z.object({
    shelfId: ShelfSchema.shape.id,
    bookId: BookSchema.shape.id,
    addedAt: z.date(),
});

export type BookOnShelfType = z.infer<typeof BookOnShelfSchema>;
