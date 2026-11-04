import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthorIfUnreferenced,
} from '../models/authors.js';
import {
  isValidAuthorId,
  getCreateAuthorBody,
  getUpdateAuthorBody,
} from '../validation/authors.js';

const sendInternalError = (res, operation, error) => {
  console.error(`${operation} failed:`, error);
  return res.status(500).json({ message: 'Internal server error' });
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return sendInternalError(res, 'GET /authors', error);
  }
};

const getAuthorById = async (req, res) => {
  const { id } = req.params;
  if (!isValidAuthorId(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const author = await getAuthorByIdFromDb(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return sendInternalError(res, 'GET /authors/:id', error);
  }
};

const createAuthor = async (req, res) => {
  const author = getCreateAuthorBody(req.body);
  if (!author) {
    return res.status(400).json({ message: 'Invalid author data' });
  }

  try {
    const createdAuthor = await createAuthorInDb(author);
    return res.status(201).json(createdAuthor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Author id already exists' });
    }
    return sendInternalError(res, 'POST /authors', error);
  }
};

const updateAuthor = async (req, res) => {
  const { id } = req.params;
  if (!isValidAuthorId(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const author = getUpdateAuthorBody(req.body);
  if (!author) {
    return res.status(400).json({ message: 'Invalid author data' });
  }

  try {
    const updatedAuthor = await updateAuthorInDb(id, author);
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return sendInternalError(res, 'PUT /authors/:id', error);
  }
};

const deleteAuthor = async (req, res) => {
  const { id } = req.params;
  if (!isValidAuthorId(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const result = await deleteAuthorIfUnreferenced(id);
    if (result === 'not-found') {
      return res.status(404).json({ message: 'Author not found' });
    }
    if (result === 'referenced') {
      return res.status(409).json({
        message: 'Author cannot be deleted while books reference it',
      });
    }

    return res.status(204).send();
  } catch (error) {
    return sendInternalError(res, 'DELETE /authors/:id', error);
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
