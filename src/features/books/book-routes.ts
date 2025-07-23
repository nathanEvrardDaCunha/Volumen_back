import express from 'express';
import { readBookController } from './read-book/read-book-controllers.js';
import { createBookController } from './create-book/create-book-controllers.js';

const bookRouter = express.Router();

// When completely finished, might implement test ?
bookRouter.route('/').get(readBookController);

bookRouter.route('/').post(createBookController);

export default bookRouter;
