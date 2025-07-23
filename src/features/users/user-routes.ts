import express from 'express';
import { logoutUserController } from './logout/logout-controllers.js';
import { fetchUserController } from './user/fetch-user/fetch-user-controllers.js';
import { updateUserController } from './user/update-user/update-user-controllers.js';
import { deleteUserController } from './user/delete-user/delete-user-controllers.js';
import { fetchAvatarController } from './avatar/fetch-avatar/fetch-avatar-controllers.js';
import { updateAvatarController } from './avatar/update-avatar/update-avatar-controllers.js';

const userRouter = express.Router();

// Find a better name for the majority of features (controller => service => model)

// When completely finished, might implement test ?
userRouter.route('/').get(fetchUserController);

userRouter.route('/').patch(updateUserController);

userRouter.route('/').delete(deleteUserController);

userRouter.route('/logout').post(logoutUserController);

userRouter.route('/avatar').get(fetchAvatarController);

userRouter.route('/avatar').patch(updateAvatarController);

export default userRouter;
