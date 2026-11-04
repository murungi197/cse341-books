import express from 'express';
import booksRoutes from './src/routes/books.js';
import authorsRoutes from './src/routes/authors.js';
import swaggerUi from 'swagger-ui-express';
import openApiSpec from './src/openapi.js';

const app = express();

app.use(express.json());
app.use('/books', booksRoutes);
app.use('/authors', authorsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get('/api-docs.json', (req, res) => {
  return res.status(200).json(openApiSpec);
});

app.get('/', (req, res) => {
 return  res.status(200).json({ message: 'Server is running' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    const message = req.path.startsWith('/authors')
      ? 'Invalid author data'
      : 'Invalid request body';
    return res.status(400).json({ message });
  }

  console.error('Unhandled request error:', error);
  return res.status(500).json({ message: 'Internal server error' });
});

export default app;