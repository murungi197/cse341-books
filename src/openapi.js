import swaggerJsdoc from 'swagger-jsdoc';

const openApiSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 Books API',
      version: '1.0.0',
      description: 'Books and authors API.',
    },
    servers: [{ url: '/' }],
    components: {
      parameters: {
        CustomId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Custom ID: 1–64 letters, digits, hyphens, or underscores.',
          schema: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$' },
          example: 'a1',
        },
      },
      schemas: {
        Author: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'firstName', 'lastName'],
          properties: {
            id: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'a1' },
            firstName: { type: 'string', minLength: 1, example: 'Maya' },
            lastName: { type: 'string', minLength: 1, example: 'Rivera' },
          },
        },
        AuthorCreate: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'firstName', 'lastName'],
          properties: {
            id: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'a2' },
            firstName: { type: 'string', minLength: 1, example: 'Jordan' },
            lastName: { type: 'string', minLength: 1, example: 'Lee' },
          },
        },
        AuthorUpdate: {
          type: 'object',
          additionalProperties: false,
          required: ['firstName', 'lastName'],
          properties: {
            firstName: { type: 'string', minLength: 1, example: 'Jordan' },
            lastName: { type: 'string', minLength: 1, example: 'Morgan' },
          },
        },
        Book: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'authorId', 'title', 'publicationDate'],
          properties: {
            id: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'b1' },
            authorId: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'a1' },
            title: { type: 'string', minLength: 1, example: 'Patterns of Light' },
            publicationDate: { type: 'string', format: 'date', example: '2021-08-17' },
          },
        },
        BookCreate: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'authorId', 'title', 'publicationDate'],
          properties: {
            id: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'b4' },
            authorId: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'a1' },
            title: { type: 'string', minLength: 1, example: 'Example Book Title' },
            publicationDate: { type: 'string', format: 'date', example: '2026-01-15' },
          },
        },
        BookUpdate: {
          type: 'object',
          additionalProperties: false,
          required: ['authorId', 'title', 'publicationDate'],
          properties: {
            authorId: { type: 'string', pattern: '^[A-Za-z0-9_-]{1,64}$', example: 'a2' },
            title: { type: 'string', minLength: 1, example: 'Updated Book Title' },
            publicationDate: { type: 'string', format: 'date', example: '2026-02-20' },
          },
        },
        Error: {
          type: 'object',
          additionalProperties: false,
          required: ['message'],
          properties: { message: { type: 'string' } },
        },
      },
      responses: {
        InvalidId: {
          description: 'The route ID does not match the custom-ID format.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Invalid id' },
            },
          },
        },
        BookNotFound: {
          description: 'No book exists with that id.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Book not found' },
            },
          },
        },
        InternalServerError: {
          description: 'Unexpected server or database error.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Internal server error' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});

export default openApiSpec;
