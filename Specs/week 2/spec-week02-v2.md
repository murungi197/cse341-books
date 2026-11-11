# Books API Week 02 Specification — Version 2

## 1. Purpose and Scope

Extend the Week 01 Books API with book create, update, and delete operations, and add author CRUD operations. Books reference authors by custom string ID. All endpoints must be documented and testable in Swagger at `/api-docs`.

The API uses the existing MongoDB database and `books` collection, and adds an `authors` collection. MongoDB `_id` values are internal only: clients send and receive custom `id` values, and route parameters use those custom IDs.

## 2. Shared Data and API Rules

- Every custom `id` is a trimmed string of 1–64 letters, digits, hyphens, or underscores, and is unique within its collection.
- Every string field is trimmed and must be non-empty unless stated otherwise.
- Dates use the calendar-date format `YYYY-MM-DD`; invalid dates are rejected.
- A route ID that does not match the custom-ID format returns `400 Bad Request` with `{"message":"Invalid id"}`.
- Request bodies must contain exactly the fields documented for that operation; unknown fields, including `_id`, are rejected with `400`.
- JSON request bodies use `Content-Type: application/json`.
- Successful responses and errors are JSON except for `204 No Content`, which has no body.
- Error responses use this shape and do not expose stack traces, database details, or other internal information:

  ```json
  {
    "message": "A concise, client-safe explanation"
  }
  ```

- Unexpected server or database errors return `500` with `{"message":"Internal server error"}` and are logged server-side.
- Invalid/missing request fields and invalid author references return `400`. A duplicate custom ID returns `409`. A requested resource that does not exist returns `404`.
- Responses contain the documented fields only; MongoDB `_id` and internal database fields are not returned.

## 3. Feature 1: Book CRUD Operations and Author References

### Book Data Model

Books are stored in the `books` collection:

- `id`: required custom string ID.
- `authorId`: required custom string ID matching an existing author's `id`.
- `title`: required non-empty string.
- `publicationDate`: required valid date string in `YYYY-MM-DD` format.

Example:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

Creating or updating a book with an `authorId` that does not identify an existing author returns `400` and does not change stored data.

### `GET /books`

Return all books.

- Success: `200 OK`, JSON array of book objects (an empty array when there are no books).
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

Example success response:

```json
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  }
]
```

### `GET /books/:id`

Return the book matching the custom ID in the route.

- Success: `200 OK`, one book object.
- Not found: `404 Not Found`, `{"message":"Book not found"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

### `POST /books`

Create a book. The client supplies its custom ID.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

- Success: `201 Created`, response body is the created book object in the data-model shape.
- Invalid or missing field, malformed body, or nonexistent `authorId`: `400 Bad Request`, `{"message":"Invalid book data"}`.
- Duplicate `id`: `409 Conflict`, `{"message":"Book id already exists"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

### `PUT /books/:id`

Replace the mutable fields of an existing book. This is a full update, not a partial update. The route ID is immutable and must not be sent in the body.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

- Success: `200 OK`, response body is the updated book object, including its unchanged `id`.
- Invalid or missing field, malformed body, or nonexistent `authorId`: `400 Bad Request`, `{"message":"Invalid book data"}`.
- No book with the route ID: `404 Not Found`, `{"message":"Book not found"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

### `DELETE /books/:id`

Delete the book matching the custom ID.

- Success: `204 No Content`, no response body.
- No book with the route ID: `404 Not Found`, `{"message":"Book not found"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

## 4. Feature 2: Author CRUD Operations

### Author Data Model

Authors are stored in the `authors` collection:

- `id`: required custom string ID.
- `firstName`: required non-empty string.
- `lastName`: required non-empty string.
- Existing legacy records with `name` and `birthYear` are returned in their stored shape by author read routes; new and updated authors use the current `firstName` and `lastName` shape.

Example:

```json
{
  "id": "a1",
  "firstName": "Maya",
  "lastName": "Rivera"
}
```

### `GET /authors`

Return all authors.

- Success: `200 OK`, JSON array of author objects (an empty array when there are no authors).
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

Example success response:

```json
[
  {
    "id": "a1",
    "firstName": "Maya",
    "lastName": "Rivera"
  }
]
```

### `GET /authors/:id`

Return the author matching the custom ID in the route.

- Success: `200 OK`, one author object.
- Not found: `404 Not Found`, `{"message":"Author not found"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

### `POST /authors`

Create an author. The client supplies its custom ID.

Request body:

```json
{
  "id": "a2",
  "firstName": "Jordan",
  "lastName": "Lee"
}
```

- Success: `201 Created`, response body is the created author object.
- Invalid or missing field or malformed body: `400 Bad Request`, `{"message":"Invalid author data"}`.
- Duplicate `id`: `409 Conflict`, `{"message":"Author id already exists"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

### `PUT /authors/:id`

Replace an existing author's mutable fields. This is a full update, not a partial update. The route ID is immutable and must not be sent in the body.

Request body:

```json
{
  "firstName": "Jordan",
  "lastName": "Morgan"
}
```

- Success: `200 OK`, response body is the updated author object, including its unchanged `id`.
- Invalid or missing field or malformed body: `400 Bad Request`, `{"message":"Invalid author data"}`.
- No author with the route ID: `404 Not Found`, `{"message":"Author not found"}`.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

### `DELETE /authors/:id`

Delete an author only when no book references the author's `id` in `authorId`.

- Success: `204 No Content`, no response body.
- No author with the route ID: `404 Not Found`, `{"message":"Author not found"}`.
- One or more books reference this author: `409 Conflict`, `{"message":"Author cannot be deleted while books reference it"}`. Keep both the author and all books unchanged.
- Error: `500 Internal Server Error`, `{"message":"Internal server error"}`.

The reference check and deletion must not leave a book pointing to a deleted author.

## 5. Validation, Security, and Efficiency Decisions

- Validate IDs, required fields, string values, date values, and author references before writing. Enforce custom-ID uniqueness in the database as well as handling duplicate-key errors, so concurrent creates cannot create duplicate IDs.
- Never trust a client-supplied `authorId`; verify it against the `authors` collection for each book create or update.
- Do not allow clients to set or overwrite MongoDB `_id` or other database-managed fields.
- Return only generic server-error details to clients; log diagnostic details on the server. Keep database credentials in environment configuration, not source code.
- Authentication and authorization are out of scope for this coursework API; do not imply that these public CRUD routes are suitable for sensitive production data.
- The expected coursework dataset is small, so list routes return arrays without pagination. Add pagination before using these routes with a growing or production dataset.
- Deleting an author with associated books is rejected rather than cascading deletion, preserving book records and referential integrity.



## 6. Swagger and Deployment Acceptance Criteria

- Swagger documents all ten routes in this specification, including request schemas, success responses, error status codes, and representative JSON bodies.
- Each route can be tested locally and from the deployed Render application.
- `/api-docs` is available on the deployed application and documents the same behavior as the implementation.
- Route IDs and all response objects use custom IDs; MongoDB `_id` is never required in a client request or exposed in a response.
