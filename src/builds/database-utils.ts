import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Add zod .default() ?

const EnvSchema = z.enum(['production', 'development']).default('development');
type EnvType = z.infer<typeof EnvSchema>;

const envValue = process.env.NODE_ENV;

let env: EnvType;
try {
    env = EnvSchema.parse(envValue);
} catch (error) {
    console.error('Environment environment variable invalid:', error);
    process.exit(1);
}

export const SSL = env === 'production' ? { rejectUnauthorized: false } : false;
