import express from 'express';
import { fetchBookController, saveBookController } from './book-controllers.js';

const bookRouter = express.Router();

// When completely finished, might implement test ?
bookRouter.route('/').get(fetchBookController);

bookRouter.route('/').post(saveBookController);

export default bookRouter;
