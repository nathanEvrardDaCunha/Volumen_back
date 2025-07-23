import express from 'express';
import { readBooksOnShelvesController } from './read-books-on-shelves/read-books-on-shelves-controllers.js';

const bookOnShelfRouter = express.Router();

// When completely finished, might implement test ?
bookOnShelfRouter.route('/').get(readBooksOnShelvesController);

export default bookOnShelfRouter;
