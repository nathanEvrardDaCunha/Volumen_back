import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Add zod .default() ?

const JwtSchema = z.object({
    access_token: z.string().min(5),
    refresh_token: z.string().min(5),
});
type JwtType = z.infer<typeof JwtSchema>;

const JwtEnv = {
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
};

let jwt: JwtType;
try {
    jwt = JwtSchema.parse(JwtEnv);
} catch (error) {
    console.error('Jwt environment variables invalids:', error);
    process.exit(1);
}

const JWT = {
    ACCESS_TOKEN: jwt.access_token,
    REFRESH_TOKEN: jwt.refresh_token,
} as const;
export default JWT;
