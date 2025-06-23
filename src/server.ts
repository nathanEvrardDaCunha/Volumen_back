import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

console.log(`Hello World\n`);

const app = express();
app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});
