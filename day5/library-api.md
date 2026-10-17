Markdown
# Library REST API Design

A RESTful API specification for managing library books resources.

## Endpoints

### 1. List all books
- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieve a list of all books in the library inventory.
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

Success Status Code: 201 Created

### 4. Update an existing book
- **Method:** PUT
- **Path:** /api/books/{id}
- **Description:** Update details for an existing book record by its ID.
- **Example Request Body:**
  ```json
  {
    "title": "Clean Code (Updated Edition)",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "publishedYear": 2008
  }

Success Status Code: 200 OK

### 5. Delete a book
- **Method:** DELETE
- **Path:** /api/books/{id}
- **Description:** Remove a book from the library database by its ID.
- **Success Status Code:** 204 No Content

### 6. List books by an author
- **Method:** GET
- **Path:** /api/books?author=name
- **Description:** Retrieve a filtered list of books written by a specific author using a query parameter.
- **Success Status Code:** 200 OK

## Error Handling & Status Codes

- **`400 Bad Request`**
  - **When it happens:** Triggered when a `POST` or `PUT` request is submitted with missing required fields or malformed JSON syntax.
- **`404 Not Found`**
  - **When it happens:** Triggered when a `GET`, `PUT`, or `DELETE` request targets a specific book ID that does not exist in the database.