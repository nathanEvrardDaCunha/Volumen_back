import express from 'express';
import { createUserController } from './auth-controllers.js';

const authRouter = express.Router();

// When completely finished, might implement test ?
authRouter.route('/').post(createUserController);

export default authRouter;
