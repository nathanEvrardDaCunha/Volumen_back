import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const BcryptSchema = z
    .preprocess((val) => parseInt(String(val), 10), z.number().min(10).max(15))
    .readonly();

const { success, data, error } = BcryptSchema.safeParse(
    process.env.BCRYPT_HASHING_ROUND
);

if (!success) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:\n', error.stack);
    } else {
        console.error('❌ Unexpected error during variables loading:\n', error);
    }
    process.exit(1);
}

console.log('Bcrypt environment variables loaded successfully.');

const BCRYPT = data;

export default BCRYPT;
