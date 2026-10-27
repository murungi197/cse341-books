import { getAllBooks as fetchAllBooks, getBookById } from '../models/books.js';

const bookFields = ['id', 'author', 'title', 'publicationDate'];

const hasBookFields = (value) => {
  return value && bookFields.every((field) => {
    return typeof value[field] === 'string';
  });
};

const toBook = (document) => {
  const book = hasBookFields(document) ? document : document._id;

  if (!hasBookFields(book)) {
    throw new Error('Book document is missing required fields.');
  }

  return Object.fromEntries(bookFields.map((field) => {
    return [field, book[field]];
  }));
};

const getAllBooks = async (req, res) => {
  try {
    const documents = await fetchAllBooks();
    const books = documents.map(toBook);
    console.log(`Successfully fetched ${books.length} books.`);

    return res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books from database:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const document = await getBookById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(toBook(document));
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getAllBooks, getBookByIdHandler };
