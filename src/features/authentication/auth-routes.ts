import express from 'express';
import { registerController } from './register/register-controller.js';
import { loginController } from './login/login-controller.js';

const authRouter = express.Router();

// When completely finished, might implement test ?
authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

export default authRouter;
