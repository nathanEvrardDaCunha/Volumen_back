import express, { Application } from 'express';
import dotenv from 'dotenv';
import authRouter from './features/authentication/auth-routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDB, initializeDB } from './builds/database.js';
import APP from './server-constants.js';
import errorHandler from './middlewares/errors/error-handlers.js';
import { tokenHandler } from './middlewares/token/token-handlers.js';
import userRouter from './features/users/user-routes.js';

dotenv.config();

const app: Application = express();

interface CorsOption {
    origin: string | string[];
    methods: string;
    allowedHeaders: string[];
    credentials: boolean;
}

const corsOptions: CorsOption = {
    origin: `${APP.FRONT_URL}:${APP.FRONT_PORT}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);

app.use(tokenHandler);
app.use('/api/users', userRouter);

// Create default route for 404 not found

app.use(errorHandler);

async function startServer(): Promise<void> {
    try {
        console.log('Starting server...');

        await connectToDB();
        await initializeDB();

        app.listen(APP.API_PORT, () => {
            console.log(`Server running in ${APP.ENV} mode`);
            console.log(`Server running at: ${APP.API_URL}:${APP.API_PORT}`);
            console.log('Database connection successful');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
