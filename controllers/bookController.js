const Book = require('../models/Book');

// GET all
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1});
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET a specific one with ID
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found'});
        res.json(book);
     } catch (err) {
        res.status(500).json({ error: err.message});
     }
};

// CREATE new book
exports.createBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
};

// UPDATE an existing book by ID
exports.editBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found'});
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
};

// DELETE an existing book by ID
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found'});
        res.json({ message: 'Book deleted successfully'});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};