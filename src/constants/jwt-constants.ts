import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const JwtSchema = z
    .object({
        access_token: z.string().min(5),
        refresh_token: z.string().min(5),
    })
    .readonly();

const { success, data, error } = JwtSchema.safeParse({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
});

if (!success) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:\n', error.stack);
    } else {
        console.error('❌ Unexpected error during variables loading:\n', error);
    }
    process.exit(1);
}

console.log('Jwt environment variables loaded successfully.');

const JWT = data;

export default JWT;
