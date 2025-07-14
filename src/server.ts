import express from 'express';
import dotenv from 'dotenv';
import authRouter from './features/authentication/auth-routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDB, initializeDB } from './builds/db.js';
import APP from './constants/app-constants.js';
import userRouter from './features/users/user-routes.js';
import errorHandler from './middlewares/error-handlers.js';
import notFoundHandler from './middlewares/not-found-handlers.js';
import tokenHandler from './middlewares/token-handlers.js';
import rateHandler from './middlewares/rate-limiter-handlers.js';
import tokenRouter from './features/token/token-routes.js';
import bookRouter from './features/books/book-routes.js';

dotenv.config();

const app = express();

interface CorsOption {
    origin: string | string[];
    methods: string;
    allowedHeaders: string[];
    credentials: boolean;
}

const corsOptions: CorsOption = {
    origin: `${APP.front_url}:${APP.front_port}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(rateHandler);

app.use('/api/auth', authRouter);
app.use('/api/token', tokenRouter);

app.use('/api/users', tokenHandler, userRouter);
app.use('/api/books', tokenHandler, bookRouter);

app.use(notFoundHandler);

app.use(errorHandler);

async function startServer(): Promise<void> {
    try {
        console.log('Starting server...');

        await connectToDB();
        await initializeDB();

        app.listen(APP.api_port, () => {
            console.log(`Server running in ${APP.app_env} mode`);
            console.log(`Server running at: ${APP.api_url}:${APP.api_port}`);
            console.log('Database connection successful');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
