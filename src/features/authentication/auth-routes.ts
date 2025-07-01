import express from 'express';
import { loginController, registerController } from './auth-controllers.js';

const authRouter = express.Router();

// When completely finished, might implement test ?
authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

export default authRouter;
