import express, { Router } from 'express';
import { refreshTokenController } from './refresh/token-controllers.js';

const tokenRouter: Router = express.Router();

tokenRouter.route('/refresh').get(refreshTokenController);

export default tokenRouter;
