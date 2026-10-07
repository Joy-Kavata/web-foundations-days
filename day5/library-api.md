# Library REST API Design

A RESTful API specification for managing library books resources.

## Endpoints

### 1. List all books
- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieve a paginated list of all books in the library inventory.
- **Success Status Code:** `200 OK`

### 2. Get a single book
- **Method:** `GET`
- **Path:** `/api/books/{id}`
- **Description:** Retrieve detailed information for a specific book by its unique ID.
- **Success Status Code:** `200 OK`

### 3. Create a new book
- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Add a new book to the library catalog.
- **Example Request Body:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "publishedYear": 2008
  }