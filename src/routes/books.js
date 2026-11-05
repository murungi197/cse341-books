import express from 'express';
import {
  getAllBooks,
  getBookByIdHandler,
  createBook,
  updateBook,
  deleteBookHandler,
} from '../controllers/books.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', getAllBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by custom ID
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomId'
 *     responses:
 *       200:
 *         description: The matching book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         $ref: '#/components/responses/BookNotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', getBookByIdHandler);

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *           example:
 *             id: b4
 *             authorId: a1
 *             title: Example Book Title
 *             publicationDate: 2026-01-15
 *     responses:
 *       201:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid fields, missing data, duplicate ID, or missing author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Invalid book data
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', createBook);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *           example:
 *             authorId: a2
 *             title: Updated Book Title
 *             publicationDate: 2026-02-20
 *     responses:
 *       200:
 *         description: The updated book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid route ID, invalid data, or referenced author does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Invalid book data
 *       404:
 *         $ref: '#/components/responses/BookNotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomId'
 *     responses:
 *       204:
 *         description: The book was deleted.
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         $ref: '#/components/responses/BookNotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', updateBook);
router.delete('/:id', deleteBookHandler);

export default router;
