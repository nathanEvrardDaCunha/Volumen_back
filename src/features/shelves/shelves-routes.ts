import express from 'express';
import { readShelvesController } from './read-shelves/read-shelves-controllers.js';
import { createShelfController } from './create-shelf/create-shelf-controllers.js';

const shelfRouter = express.Router();

// When completely finished, might implement test ?
shelfRouter.route('/').get(readShelvesController);

shelfRouter.route('/').post(createShelfController);

export default shelfRouter;
