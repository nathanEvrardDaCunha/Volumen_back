import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

console.log(`\nHello World\n`);
console.log(`DATABASE_USER: ${process.env.DATABASE_USER}`);
console.log(`DATABASE_NAME: ${process.env.DATABASE_NAME}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}\n`);

const app = express();
app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});
