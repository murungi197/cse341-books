import express from 'express';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: An array of authors, or an empty array.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *             example:
 *               - id: a1
 *                 firstName: Maya
 *                 lastName: Rivera
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get an author by custom ID
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomId'
 *     responses:
 *       200:
 *         description: The matching author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         description: No author exists with that ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Author not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   put:
 *     summary: Replace an author's mutable fields
 *     description: Full update. The route ID is immutable and must not be sent in the body.
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *           example:
 *             firstName: Jordan
 *             lastName: Morgan
 *     responses:
 *       200:
 *         description: The updated author, including its unchanged custom ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid route ID or author data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidId:
 *                 value:
 *                   message: Invalid id
 *               invalidAuthorData:
 *                 value:
 *                   message: Invalid author data
 *       404:
 *         description: No author exists with that ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Author not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete an unreferenced author
 *     description: Deletion is rejected while any book references this author.
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomId'
 *     responses:
 *       204:
 *         description: Author deleted; no response body.
 *       400:
 *         $ref: '#/components/responses/InvalidId'
 *       404:
 *         description: No author exists with that ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Author not found
 *       409:
 *         description: One or more books reference this author; neither collection is changed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Author cannot be deleted while books reference it
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', getAuthorById);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreate'
 *           example:
 *             id: a2
 *             firstName: Jordan
 *             lastName: Lee
 *     responses:
 *       201:
 *         description: The created author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing, invalid, or unexpected author data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Invalid author data
 *       409:
 *         description: The custom author ID is already in use.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Author id already exists
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', createAuthor);

export default router;
