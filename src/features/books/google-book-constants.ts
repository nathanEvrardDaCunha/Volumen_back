import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const GoogleBookSchema = z.string().min(1).readonly();

const { success, data, error } = GoogleBookSchema.safeParse(
    process.env.GOOGLE_BOOK_API
);

if (!success) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:\n', error.stack);
    } else {
        console.error('❌ Unexpected error during variables loading:\n', error);
    }
    process.exit(1);
}

console.log('Google Book environment variables loaded successfully.');

const GOOGLE = data;

export default GOOGLE;
