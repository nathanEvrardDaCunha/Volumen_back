import express from 'express';
import { fetchBookController } from './book-controllers.js';

const bookRouter = express.Router();

// When completely finished, might implement test ?
bookRouter.route('/').get(fetchBookController);

export default bookRouter;
