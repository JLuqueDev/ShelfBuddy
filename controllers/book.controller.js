const Book = require('../models/Book');

// GET all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1});
        res.json(books);
        console.log('Full book list displayed!');
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error('GET-a book.ctrl error', err.message);
    }
};

// GET a specific book with ID
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found'});
        res.json(book);
        console.log('Requested item displayed!');
        
     } catch (err) {
        res.status(500).json({ error: err.message});
        console.error('GET-one book.ctrl error', err.message);
     }
};

// CREATE new book
exports.createBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json({savedBook, message: 'Book logged successfully!'});
        console.log('Book logged successfully!');
    } catch (err) {
        res.status(400).json({ error: err.message});
        console.error('POST book.ctrl error', err.message);
    }
};

// UPDATE an existing book by ID
exports.editBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true}
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found'});
        res.json({updatedBook, message: 'Info updated successfully!'});
        console.log('Info updated successfully!');
    } catch (err) {
        res.status(400).json({ error: err.message});
        console.error('PUT book.ctrl error', err.message);
    }
};

// DELETE an existing book by ID
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found'});
        res.json({ message: 'Book deleted successfully!'});
        console.log('Book deleted successfully!');
    } catch (err) {
        res.status(500).json({ error: err.message});
        console.error('DEL book.ctrl error', err.message);
    }
};