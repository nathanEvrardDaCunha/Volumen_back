// Add a "s" to every file named "schema" => "schemas"
import { z } from 'zod';

export const ShelfSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string().min(1).max(100),
    isPublic: z.boolean(),
    isCustom: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type ShelfType = z.infer<typeof ShelfSchema>;
