const Book = require('../models/Book');

// GET all books for the authenticated user
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({user: req.user.id}).sort({createdAt: -1});
        res.json(books);
        console.log('Full book list cached!');
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error('GET-a book.ctrl error', err.message);
    }
};

// GET a specific book with ID
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id,
            user: req.user.id
        });
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
        const newBook = new Book({
            ...req.body,
            user: req.user.id
        });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
        console.log('Book logged successfully!');
    } catch (err) {
        console.error('POST book.ctrl error:', err.message);
        if (err.code === 11000) {
           return res.status(400).json({ error: 'A book with this title already exists in your library.'});
        }
        res.status(400).json({ error: err.message });
    }
};

// UPDATE an existing book by ID
exports.editBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            //to enforce user ownership 
            { _id: req.params.id, user: req.user.id },
            req.body,
            { returnDocument: 'after', runValidators: true}
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found or unauthorized'});
        res.json(updatedBook);
        console.log('Info updated successfully!');

    } catch (err) {
        console.error('PUT book.ctrl error', err.message);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'A book with this title already exists in your library.'});
        }
        res.status(400).json({ error: err.message });
    }
};

// DELETE an existing book by ID
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!deletedBook) {
            console.log('Book not found or unauthorized');
            return res.status(404).json({ message: 'Book not found'});
        }
        res.json({ message: 'Book deleted successfully!'});
        console.log('Book deleted successfully!');
    } catch (err) {
        res.status(500).json({ error: err.message});
        console.error('DEL book.ctrl error', err.message);
    }
};