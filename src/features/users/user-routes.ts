import express from 'express';
import { logoutUserController } from './logout/logout-controller.js';
import { fetchUserController } from './user/fetch-user/fetch-user-controller.js';
import { updateUserController } from './user/update-user/update-user-controller.js';
import { deleteUserController } from './user/delete-user/delete-user-controller.js';
import { fetchAvatarController } from './avatar/fetch-avatar/fetch-avatar-controller.js';
import { updateAvatarController } from './avatar/update-avatar/update-avatar-controller.js';

const userRouter = express.Router();

// When completely finished, might implement test ?
userRouter.route('/').get(fetchUserController);

userRouter.route('/').patch(updateUserController);

userRouter.route('/').delete(deleteUserController);

userRouter.route('/logout').post(logoutUserController);

userRouter.route('/avatar').get(fetchAvatarController);

userRouter.route('/avatar').patch(updateAvatarController);

export default userRouter;
