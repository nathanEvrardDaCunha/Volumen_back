import { z } from 'zod';
import GOOGLE from './google-book-constants.js';

const IndustryIdentifierSchema = z.object({
    type: z.string(),
    identifier: z.string(),
});

const DimensionsSchema = z.object({
    height: z.string().optional(),
    width: z.string().optional(),
    thickness: z.string().optional(),
});

const PriceSchema = z.object({
    amount: z.number(),
    currencyCode: z.string(),
});

const VolumeInfoSchema = z.object({
    title: z.string().optional(),
    authors: z.array(z.string()).optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    publisher: z.string().optional(),
    publishedDate: z.string().optional(),
    industryIdentifiers: z.array(IndustryIdentifierSchema).optional(),
    pageCount: z.number().optional(),
    dimensions: DimensionsSchema.optional(),
    maturityRating: z.string().optional(),
    language: z.string().optional(),
    previewLink: z.string().optional(),
    infoLink: z.string().optional(),
    canonicalVolumeLink: z.string().optional(),
    categories: z.array(z.string()).optional(),
});

const SaleInfoSchema = z.object({
    country: z.string().optional(),
    saleability: z.string().optional(),
    isEbook: z.boolean().optional(),
    listPrice: PriceSchema.optional(),
    retailPrice: PriceSchema.optional(),
    buyLink: z.string().optional(),
});

const BookItemSchema = z.object({
    id: z.string(),
    selfLink: z.string(),
    volumeInfo: VolumeInfoSchema,
    saleInfo: SaleInfoSchema,
});

const GoogleBookResponseSchema = z.object({
    items: z.array(BookItemSchema),
});

type BookItem = z.infer<typeof BookItemSchema>;

const BookSchema = z.object({
    id: z.string(),
    selfLink: z.string(),
    volumeInfo: VolumeInfoSchema,
    saleInfo: SaleInfoSchema,
});

export type Book = z.infer<typeof BookSchema>;

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
