import express from 'express';
import { createCustomShelfController } from './shelves-controllers.js';

const shelfRouter = express.Router();

// When completely finished, might implement test ?
shelfRouter.route('/').post(createCustomShelfController);

export default shelfRouter;
