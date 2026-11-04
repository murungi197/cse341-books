import { getDb } from '../db/connect.js';

const authorProjection = {
  _id: 0,
  id: 1,
  firstName: 1,
  lastName: 1,
};

const getAllAuthors = async () => {
  return getDb().collection('authors')
    .find({}, { projection: authorProjection })
    .toArray();
};

const getAuthorById = async (id) => {
  return getDb().collection('authors').findOne(
    { id },
    { projection: authorProjection },
  );
};

const createAuthor = async (author) => {
  await getDb().collection('authors').insertOne(author);
  return author;
};

const updateAuthor = async (id, author) => {
  const result = await getDb().collection('authors').updateOne(
    { id },
    { $set: author },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return getAuthorById(id);
};

const deleteAuthorIfUnreferenced = async (id) => {
  const db = getDb();
  const session = db.client.startSession();
  let outcome;

  try {
    await session.withTransaction(async () => {
      const author = await db.collection('authors').findOne(
        { id },
        { session, projection: authorProjection },
      );

      if (!author) {
        outcome = 'not-found';
        return;
      }

      const hasBooks = await db.collection('books').findOne(
        { authorId: id },
        { session, projection: { _id: 1 } },
      );

      if (hasBooks) {
        outcome = 'referenced';
        return;
      }

      const result = await db.collection('authors').deleteOne({ id }, { session });
      outcome = result.deletedCount === 1 ? 'deleted' : 'not-found';
    });
  } finally {
    await session.endSession();
  }

  return outcome;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthorIfUnreferenced,
};
