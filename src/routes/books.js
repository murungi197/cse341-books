import express from 'express';
import { getAllBooks, getBookByIdHandler } from '../controllers/books.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookByIdHandler);

export default router;
