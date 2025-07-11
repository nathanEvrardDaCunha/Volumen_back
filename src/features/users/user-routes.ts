import express from 'express';
import {
    deleteUserController,
    fetchUserController,
    logoutUserController,
    updateUserController,
} from './user-controllers.js';

const userRouter = express.Router();

// When completely finished, might implement test ?
userRouter.route('/').get(fetchUserController);

userRouter.route('/').patch(updateUserController);

userRouter.route('/').delete(deleteUserController);

userRouter.route('/logout').post(logoutUserController);

export default userRouter;
