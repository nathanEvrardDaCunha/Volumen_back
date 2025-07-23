import express from 'express';
import {
    createCustomShelfController,
    fetchShelvesController,
} from './shelves-controllers.js';

const shelfRouter = express.Router();

// Find a better name for the majority of features (controller => service => model)

// When completely finished, might implement test ?
shelfRouter.route('/').get(fetchShelvesController);

shelfRouter.route('/').post(createCustomShelfController);

export default shelfRouter;
