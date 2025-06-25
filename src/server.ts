import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectToDB, initializeDB } from './builds/database.js';
import { APP } from './server-constants.js';

dotenv.config();

const app: Application = express();

async function startServer(): Promise<void> {
    try {
        console.log('Starting server...');

        await connectToDB();
        await initializeDB();

        app.listen(APP.PORT, () => {
            console.log(`Server running in ${APP.ENV} mode`);
            console.log(`Server running at: ${APP.URL}:${APP.PORT}`);
            console.log('Database connection successful');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
