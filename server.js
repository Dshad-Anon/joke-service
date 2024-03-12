// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./jokes.db');

// Middleware to parse JSON bodies
app.use(express.json());

// GET /jokes/random
app.get('/jokes/random', (req, res) => {
    db.get("SELECT j.*, c.name AS category_name FROM jokes j JOIN categories c ON j.category_id = c.id ORDER BY RANDOM() LIMIT 1", (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(row);
        }
    });
});


// GET /jokes/random/:category
app.get('/jokes/random/:category', (req, res) => {
    const { category } = req.params;
    // First, retrieve the category ID based on the category name
    db.get("SELECT id FROM categories WHERE name = ?", [category], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            const categoryId = row.id;
            // Now, retrieve a random joke from that category ID
            db.get("SELECT * FROM jokes WHERE category_id = ? ORDER BY RANDOM() LIMIT 1", [categoryId], (err, joke) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.json(joke);
                }
            });
        }
    });
});


// GET /categories
app.get('/categories', (req, res) => {
    db.all("SELECT * FROM categories", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// GET /jokes/:category
app.get('/jokes/:category', (req, res) => {
    const { category } = req.params;
    // First, retrieve the category ID based on the category name
    db.get("SELECT id FROM categories WHERE name = ?", [category], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            const categoryId = row.id;
            // Now, retrieve all jokes from that category ID
            db.all("SELECT * FROM jokes WHERE category_id = ?", [categoryId], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.json(rows);
                }
            });
        }
    });
});


// GET /jokes/:id
app.get('/joke/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM jokes WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Joke not found' });
        } else {
            res.json(row);
        }
    });
});


// POST /categories
app.post('/categories', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO categories (name) VALUES (?)", [name], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Category added successfully', id: this.lastID });
        }
    });
});


// POST /jokes/:category
app.post('/jokes/:category', (req, res) => {
    const { category } = req.params;
    const { joke_text } = req.body;

    // First, check if the category exists
    db.get("SELECT id FROM categories WHERE name = ?", [category], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            const categoryId = row.id;
            // Category found, now insert the joke into the category
            db.run("INSERT INTO jokes (joke_text, category_id) VALUES (?, ?)", [joke_text, categoryId], function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.json({ message: 'Joke added successfully', id: this.lastID });
                }
            });
        }
    });
});

// POST /jokes/:id/category/:category
app.post('/joke/:id/category/:category', (req, res) => {
    const { id, category } = req.params;

    // First, check if the joke exists
    db.get("SELECT * FROM jokes WHERE id = ?", [id], (err, jokeRow) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!jokeRow) {
            res.status(404).json({ error: 'Joke not found' });
        } else {
            // Next, check if the category exists
            db.get("SELECT id FROM categories WHERE name = ?", [category], (err, catRow) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else if (!catRow) {
                    res.status(404).json({ error: 'Category not found' });
                } else {
                    const categoryId = catRow.id;
                    // Finally, insert a new entry for the joke in the new category
                    db.run("INSERT INTO jokes (joke_text, category_id) VALUES (?, ?)", [jokeRow.joke_text, categoryId], function(err) {
                        if (err) {
                            console.error(err.message);
                            res.status(500).json({ error: 'Internal Server Error' });
                        } else {
                            res.json({ message: 'Joke copied to new category successfully', id: this.lastID });
                        }
                    });
                }
            });
        }
    });
});



// POST /jokes/:id/:type
app.post('/joke/:id/:type', (req, res) => {
    const { id, type } = req.params;
    if (type !== 'like' && type !== 'dislike') {
        res.status(400).json({ error: 'Invalid vote type' });
    } else {
        db.run(`UPDATE jokes SET ${type}s = ${type}s + 1 WHERE id = ?`, [id], function(err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Joke not found' });
            } else {
                res.json({ message: `Vote recorded successfully for ${type}` });
            }
        });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
