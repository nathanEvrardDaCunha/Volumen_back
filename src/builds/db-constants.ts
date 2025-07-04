import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const DbSchema = z
    .object({
        name: z.string().min(1),
        password: z.string().min(1),
        user: z.string().min(1),
        host: z.string().min(1),
        port: z.preprocess(
            (val) => parseInt(String(val), 10),
            z.number().min(1)
        ),
        url: z.string().url().min(1),
    })
    .readonly();

const { success, data, error } = DbSchema.safeParse({
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    url: process.env.DATABASE_URL,
});

if (!success) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:\n', error.stack);
    } else {
        console.error('❌ Unexpected error during variables loading:\n', error);
    }
    process.exit(1);
}

console.log('Database environment variables loaded successfully.');

const DB = data;

export default DB;
