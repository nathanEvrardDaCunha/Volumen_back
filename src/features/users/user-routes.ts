import express from 'express';
import {
    fetchUserController,
    logoutUserController,
} from './user-controllers.js';

const userRouter = express.Router();

// When completely finished, might implement test ?
userRouter.route('/').get(fetchUserController);

userRouter.route('/logout').post(logoutUserController);

export default userRouter;
