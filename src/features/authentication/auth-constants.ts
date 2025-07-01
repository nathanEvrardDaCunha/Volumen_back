import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Add zod .default() ?

const BCryptSchema = z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().min(10).max(15)
);
type BCryptType = z.infer<typeof BCryptSchema>;

const envBCrypt = process.env.BCRYPT_HASHING_ROUND;

let bcrypt: BCryptType;
try {
    bcrypt = BCryptSchema.parse(envBCrypt);
} catch (error) {
    console.error('BCrypt environment variable invalid:', error);
    process.exit(1);
}

const BCRYPT_ROUND = bcrypt;
export default BCRYPT_ROUND;
