const Book = require('../models/Book');

const checkDuplicateTitle = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) {
            return next();
        }
        const existingBook = await Book.findOne({
        title: { $regex: new RegExp(`^${title.trim()}`, 'i')},
        user: req.user.id     
    });
        if (existingBook) {
        return res.status(409).json({
            error: `A book titled '${title}' already exists in your catalog.`
        });
        }
        next();
    } catch (err) {
        console.error('Duplicate middleware error:', err.message)
    res.status(500).json({ err: err.message});
    }
};

module.exports = checkDuplicateTitle;