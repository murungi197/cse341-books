import { getDb } from '../db/connect.js';

const bookProjection = {
  _id: 0,
  id: 1,
  authorId: 1,
  title: 1,
  publicationDate: 1,
};

const getAllBooks = async () => {
  return getDb().collection('books')
    .find({}, { projection: bookProjection })
    .toArray();
};

const getBookById = async (bookId) => {
  return getDb().collection('books').findOne(
    { id: bookId },
    { projection: bookProjection },
  );
};

const createBook = async (book) => {
  await getDb().collection('books').insertOne(book);
  return book;
};

const updateBook = async (id, book) => {
  const result = await getDb().collection('books').updateOne({ id }, { $set: book });
  if (result.matchedCount === 0) {
    return null;
  }

  return getBookById(id);
};

const deleteBook = async (id) => {
  const result = await getDb().collection('books').deleteOne({ id });
  return result.deletedCount === 1;
};

const authorExists = async (authorId) => {
  return getDb().collection('authors').findOne(
    { id: authorId },
    { projection: { _id: 0, id: 1 } },
  );
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
};
