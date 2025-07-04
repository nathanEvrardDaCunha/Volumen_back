import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const AppSchema = z
    .object({
        app_env: z.enum(['production', 'development']),
        api_url: z.string().min(1),
        api_port: z.preprocess(
            (val) => parseInt(String(val), 10),
            z.number().min(1)
        ),
        front_url: z.string().min(1),
        front_port: z.preprocess(
            (val) => parseInt(String(val), 10),
            z.number().min(1)
        ),
    })
    .readonly();

const { success, data, error } = AppSchema.safeParse({
    app_env: process.env.APP_ENV,
    api_url: process.env.API_URL,
    api_port: process.env.API_PORT,
    front_url: process.env.FRONT_URL,
    front_port: process.env.FRONT_PORT,
});

if (!success) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:\n', error.stack);
    } else {
        console.error('❌ Unexpected error during variables loading:\n', error);
    }
    process.exit(1);
}

console.log('Application environment variables loaded successfully.');

const APP = data;

export default APP;
