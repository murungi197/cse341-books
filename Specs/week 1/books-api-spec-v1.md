
# Books API Specification — Version 1

## 1. Purpose
Create a basic web service that returns book data. The API will allow users to retrieve all books or retrieve one book by its ID.

## 2. Data Model

- id: string
- author: string
- title: string
- publicationDate: string

## 3. API Endpoints

### Endpoint 1: Retrieve All Books

- HTTP Method: GET
- URL: /books
- Description:Returns all books stored in the database.
- Success Status Code:200 OK
- Response Format: JSON array of book objects.

### Endpoint 2: Retrieve One Book by ID

- HTTP Method:GET
- URL: /books/:id
- Description: Returns the book that matches the requested id or the   objectid
- Success Status Code: 200 OK
- Not Found Status Code: 404 not found

## 4. Database

- Database: MongoDb
- Collection:books

## 5. Initial Assumptions

- The API will return data in JSON format.
- Each book will have a unique custom id.
- The books collection will contain book records for testing.
- The API will only retrieve books in this version; it will not  create, update, or delete books.
