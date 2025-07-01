import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const AppSchema = z.object({
    env: z.enum(['production', 'development']).default('development'),
    api_url: z.string().min(1).default('http://localhost'),
    api_port: z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().min(1).default(5003)
    ),
    front_url: z.string().min(1).default('http://localhost'),
    front_port: z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().min(1).default(5003)
    ),
});
type AppType = z.infer<typeof AppSchema>;

const appEnv = {
    env: process.env.NODE_ENV,
    api_url: process.env.API_URL,
    api_port: process.env.API_PORT,
    front_url: process.env.FRONT_URL,
    front_port: process.env.FRONT_PORT,
};

let app: AppType;
try {
    app = AppSchema.parse(appEnv);
} catch (error) {
    console.error('Application environment variable invalid:', error);
    process.exit(1);
}

const APP = {
    ENV: app.env,
    API_URL: app.api_url,
    API_PORT: app.api_port,
    FRONT_URL: app.front_url,
    FRONT_PORT: app.front_port,
};
export default APP;
