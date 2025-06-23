import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

console.log(`\n Hello World \n`);

console.log(`\n DATABASE_USER: ${process.env.DATABASE_USER} \n`);

const app = express();
app.listen(4000, () => {
    console.log(`server running on port 4000`);
});
