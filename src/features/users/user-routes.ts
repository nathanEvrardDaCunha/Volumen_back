import express from 'express';
import {
    deleteUserController,
    fetchAvatarController,
    fetchUserController,
    logoutUserController,
    updateAvatarController,
    updateUserController,
} from './user-controllers.js';

const userRouter = express.Router();

// When completely finished, might implement test ?
userRouter.route('/').get(fetchUserController);

userRouter.route('/avatar').get(fetchAvatarController);

userRouter.route('/avatar').patch(updateAvatarController);

userRouter.route('/').patch(updateUserController);

userRouter.route('/').delete(deleteUserController);

userRouter.route('/logout').post(logoutUserController);

export default userRouter;
