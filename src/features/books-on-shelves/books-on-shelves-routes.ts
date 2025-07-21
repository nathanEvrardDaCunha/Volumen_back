import express from 'express';
import { fetchBooksFromUserShelvesController } from './books-on-shelves-controllers.js';

const bookOnShelfRouter = express.Router();

// When completely finished, might implement test ?
bookOnShelfRouter.route('/').get(fetchBooksFromUserShelvesController);

// bookOnShelfRouter.route('/').post(createCustomShelfController);

export default bookOnShelfRouter;
