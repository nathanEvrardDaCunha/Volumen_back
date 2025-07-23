import { z } from 'zod';

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

export const BookItemSchema = z.object({
    id: z.string(),
    selfLink: z.string(),
    volumeInfo: VolumeInfoSchema,
    saleInfo: SaleInfoSchema,
});

export type BookItem = z.infer<typeof BookItemSchema>;

// BookItem is the same as Book ? If yes it is redundant
export const BookSchema = z.object({
    id: z.string(),
    selfLink: z.string(),
    volumeInfo: VolumeInfoSchema,
    saleInfo: SaleInfoSchema,
});

export type BookType = z.infer<typeof BookSchema>;
