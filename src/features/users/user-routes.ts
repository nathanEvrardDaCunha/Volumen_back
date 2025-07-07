import express from 'express';
import {
    fetchUserController,
    logoutUserController,
    updateUserController,
} from './user-controllers.js';

const userRouter = express.Router();

// When completely finished, might implement test ?
userRouter.route('/').get(fetchUserController);

userRouter.route('/').patch(updateUserController);

userRouter.route('/logout').post(logoutUserController);

export default userRouter;
