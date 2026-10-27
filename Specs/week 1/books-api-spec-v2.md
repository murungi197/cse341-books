# Books API Specification — Version 2

## 1. Purpose

Build a read-only Books API using Node.js, Express, and MongoDB. The API will return all books or one book by its ID.

## 2. Data Model

Database: `cse341-books-db`

Collection: `books`

Each book object contains:

- `id`: string; required and unique.
- `author`: string; required.
- `title`: string; required.
- `publicationDate`: string in ISO 8601 date format (`YYYY-MM-DD`), for example, `2021-08-17`; required.

Example book object:

```json
{
  "id": "b1",
  "author": "Maya Rivera",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

## 3. API Endpoints

### Endpoint 1: Retrieve All Books

- HTTP Method: `GET`
- URL: `/books`
- Description: Returns all books from the `books` collection.
- Success Status Code: `200 OK`
- Error Status Code: `500 Internal Server Error`
- Response Format: JSON array of book objects.

Example success response:

```json
[
  {
    "id": "b1",
    "author": "Maya Rivera",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  }
]
```

Example error response:

```json
{
  "message": "Internal server error"
}
```

### Endpoint 2: Retrieve One Book by ID

- HTTP Method: `GET`
- URL: `/books/:id`
- Description: Returns the book whose `id` matches the ID in the URL.
- Success Status Code: `200 OK`
- Not Found Status Code: `404 Not Found`
- Error Status Code: `500 Internal Server Error`
- Response Format: A JSON object containing the matching book.

Example success response:

```json
{
  "id": "b1",
  "author": "Maya Rivera",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

Example not-found response:

```json
{
  "message": "Book not found"
}
```

Example server-error response:

```json
{
  "message": "Internal server error"
}
```

## 4. Error Handling and Security

- Return a `404 Not Found` response when the requested book ID does not match a book.
- Return a `500 Internal Server Error` response when an unexpected server or database error occurs.
- Do not send stack traces, database error details, or other internal error information to API clients.
- Log useful error details on the server for debugging.
- Use the same JSON error shape for errors: `{ "message": "..." }`.

## 5. Implementation Notes

- Use a MongoDB database named `cse341-books-db` and a collection named `books`.
- Seed the collection with book documents for testing.
- Read the MongoDB connection string from an environment variable rather than hard-coding it in the source code.
- Validate required environment configuration when the application starts.

## 6. Out of Scope for Week 1

- `POST`, `PUT`, `PATCH`, and `DELETE` endpoints.
- Authentication and authorization.
