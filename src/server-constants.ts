import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const AppSchema = z.object({
    env: z.enum(['production', 'development']).default('development'),
    url: z.string().min(1).default('http://localhost'),
    port: z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().min(1).default(5003)
    ),
});
type AppType = z.infer<typeof AppSchema>;

const appEnv = {
    env: process.env.NODE_ENV,
    url: process.env.APP_URL,
    port: process.env.APP_PORT,
};

let app: AppType;
try {
    app = AppSchema.parse(appEnv);
} catch (error) {
    console.error('Application environment variable invalid:', error);
    process.exit(1);
}

export const APP = {
    ENV: app.env,
    URL: app.url,
    PORT: app.port,
};
