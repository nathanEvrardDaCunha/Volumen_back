import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const DbSchema = z.object({
    name: z.string().min(1).default('name'),
    password: z.string().min(1).default('password'),
    user: z.string().min(1).default('user'),
    host: z.string().min(1).default('db'),
    port: z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().min(1).default(5432)
    ),
    url: z.string().optional(),
});
type DbType = z.infer<typeof DbSchema>;

const dbEnv = {
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    url: process.env.DATABASE_URL,
};

let db: DbType;
try {
    db = DbSchema.parse(dbEnv);
} catch (error) {
    console.error('Database environment variables invalids:', error);
    process.exit(1);
}

const url =
    db.url ||
    `postgresql://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`;

console.log(`DB user: ${db.user}`);
console.log(`URL password: ${db.password}`);
console.log(`URL host: ${db.host}`);
console.log(`URL port: ${db.port}`);
console.log(`URL name: ${db.name}`);
console.log(`URL url: ${url}`);

export const DB = {
    NAME: db.name,
    HOST: db.host,
    PORT: db.port,
    USER: db.user,
    PASSWORD: db.password,
    URL: url,
} as const;
