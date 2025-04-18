const express = require('express'); // Import the Express framework to create the server
const bodyParser = require('body-parser'); // Import body-parser to parse incoming request bodies
const mysql = require('mysql'); // Import MySQL module to interact with the MySQL database

const app = express(); // Initialize an Express application
const port = 3000; // Set the port number for the server

// Use body-parser middleware to handle URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "books" directory
app.use(express.static("books"));

// Create a MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost', // Database host
    user: 'root', // Database username
    password: 'Whisper10!', // Database password
    database: 'books_catalog' // Name of the database
});

// Define a POST endpoint to add a new book to the database
app.post('/add-book', (req, res) => {
    const { title, author, year_published } = req.body; // Extract title, author, and year_published from the request body

    // SQL query to insert a new book record into the 'books' table
    const sql = 'INSERT INTO books (title, author, year_published) VALUES (?, ?, ?)';

    // Execute the SQL query with the extracted data
    connection.query(sql, [title, author, year_published], (error, results) => {
        if (error) throw error; // Throw an error if the query fails
        res.send('Book added successfully!'); // Send a success message if the query is successful
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log a message when the server starts
});

// Define a GET endpoint to search for books in the database
app.get('/search-books', (req, res) => {
    const searchQuery = req.query.q; // Get the search query from the request query parameters

    // SQL query to search for books by title or author
    const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';

    // Execute the SQL query with wildcards around the search query for partial matching
    connection.query(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Error fetching books', err); // Log an error message if the query fails
            return res.status(500).send('An error occurred while fetching the books'); // Send a 500 error response
        }
        res.json(results); // Send the search results as JSON if the query is successful
    });
});
