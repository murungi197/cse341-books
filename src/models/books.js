import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  return getDb().collection('books').find({}).toArray();
};

const getBookById = async (bookId) => {
  return getDb().collection('books').findOne({
    $or: [
      { id: bookId },
      { '_id.id': bookId },
    ],
  });
};

export { getAllBooks, getBookById };
