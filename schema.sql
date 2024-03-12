
-- Create a table for jokes
CREATE TABLE jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joke_text TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create a table for categories
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
