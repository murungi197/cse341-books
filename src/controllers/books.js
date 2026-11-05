import {
  getAllBooks as fetchAllBooks,
  getBookById,
  createBook as createBookInDb,
  updateBook as updateBookInDb,
  deleteBook as deleteBookInDb,
  authorExists,
} from '../models/books.js';
import {
  isValidCustomId,
  getCreateBookBody,
  getUpdateBookBody,
} from '../validation/books.js';

const sendInternalError = (res, operation, error) => {
  console.error(`${operation} failed:`, error);
  return res.status(500).json({ message: 'Internal server error' });
};

const getAllBooks = async (req, res) => {
  try {
    const books = await fetchAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return sendInternalError(res, 'GET /books', error);
  }
};

const getBookByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidCustomId(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return sendInternalError(res, 'GET /books/:id', error);
  }
};

const createBook = async (req, res) => {
  const book = getCreateBookBody(req.body);
  if (!book) {
    return res.status(400).json({ message: 'Invalid book data' });
  }

  try {
    const existingBook = await getBookById(book.id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists' });
    }

    const author = await authorExists(book.authorId);
    if (!author) {
      return res.status(400).json({ message: 'Invalid book data' });
    }

    const createdBook = await createBookInDb(book);
    return res.status(201).json(createdBook);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book id already exists' });
    }
    return sendInternalError(res, 'POST /books', error);
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  if (!isValidCustomId(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const book = getUpdateBookBody(req.body);
  if (!book) {
    return res.status(400).json({ message: 'Invalid book data' });
  }

  try {
    const existingBook = await getBookById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = await authorExists(book.authorId);
    if (!author) {
      return res.status(400).json({ message: 'Invalid book data' });
    }

    const updatedBook = await updateBookInDb(id, book);
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(updatedBook);
  } catch (error) {
    return sendInternalError(res, 'PUT /books/:id', error);
  }
};

const deleteBookHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidCustomId(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const existingBook = await getBookById(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const deleted = await deleteBookInDb(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return sendInternalError(res, 'DELETE /books/:id', error);
  }
};

export {
  getAllBooks,
  getBookByIdHandler,
  createBook,
  updateBook,
  deleteBookHandler,
};
