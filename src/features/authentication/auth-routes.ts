import express from 'express';
import { registerController } from './register/register-controller.js';
import { loginController } from './login/login-controller.js';
import { resetPasswordController } from './reset-password/reset-password-controller.js';

const authRouter = express.Router();

// When completely finished, might implement test ?
authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

authRouter.route('/reset-password').post(resetPasswordController);

export default authRouter;
