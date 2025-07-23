import z from 'zod';

export const TokenSchema = z.string().min(1);
