# Joke API

A RESTful API service for managing and retrieving jokes, built with Express.js, Node.js, and SQLite.

## Overview

This API service allows clients to:
- Retrieve random jokes
- Get jokes by category
- Add new jokes and categories
- Vote on jokes (like/dislike)
- Copy jokes between categories

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite** - Database
- **SQLite3** - Database driver

## Database Schema

The application uses two main tables:

### Jokes Table
```sql
CREATE TABLE jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joke_text TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
```

## API Endpoints

### Get Random Joke
```
GET /jokes/random
```
Returns a random joke from any category.

### Get Random Joke from Category
```
GET /jokes/random/:category
```
Returns a random joke from the specified category.

### List Categories
```
GET /categories
```
Returns a list of all available joke categories.

### Get Jokes by Category
```
GET /jokes/:category
```
Returns all jokes in the specified category.

### Get Joke by ID
```
GET /joke/:id
```
Returns a specific joke by its ID.

### Add New Category
```
POST /categories
```
Adds a new category to the database.

### Add New Joke
```
POST /jokes/:category
```
Adds a new joke to the specified category.

### Copy Joke to New Category
```
POST /joke/:id/category/:category
```
Copies an existing joke to a different category.

### Vote on Joke
```
POST /joke/:id/:type
```
Records a like or dislike vote for the specified joke.

## Setup and Installation

1. Clone the repository
```bash
git clone [repository-url]
cd joke-api
```

2. Install dependencies
```bash
npm install
```

3. Set up the SQLite database
```bash
sqlite3 jokes.db < schema.sql
```

4. Start the server
```bash
npm start
```

## Usage Examples

### Get a Random Joke
```bash
curl http://localhost:3000/jokes/random
```

Response:
```json
{
    "id": 1,
    "joke_text": "Why did the programmer quit his job? Because he didn't get arrays!",
    "category_name": "Programming",
    "likes": 10,
    "dislikes": 2
}
```

### Add a New Joke
```bash
curl -X POST http://localhost:3000/jokes/programming \
  -H "Content-Type: application/json" \
  -d '{"joke_text": "Why do programmers prefer dark mode? Because light attracts bugs!"}'
```

Response:
```json
{
    "id": 2,
    "joke_text": "Why do programmers prefer dark mode? Because light attracts bugs!",
    "category": "programming"
}
```

### Like a Joke
```bash
curl -X POST http://localhost:3000/joke/1/like
```

Response:
```json
{
    "message": "like recorded successfully"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Successful operation
- 400: Bad request (invalid input)
- 404: Resource not found
- 500: Server error

Error response format:
```json
{
    "error": "Error message description"
}
```

## Development

### Prerequisites
- Node.js
- npm
- SQLite3

### Environment Variables
- `PORT`: Server port (default: 3000)
- `DB_PATH`: Database file path (default: './jokes.db')

## Testing

Run the test suite:
```bash
npm test
```
