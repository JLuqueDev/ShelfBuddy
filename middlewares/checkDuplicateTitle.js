const Book = require('../models/Book');

const checkDuplicateTitle = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) {
            return next();
        }
        const existingBook = await Book.findOne({
        title: { $regex: new RegExp(`^${title.trim()}`, 'i')}
    });
        if (existingBook) {
        return res.status(409).json({
            error: `A book titled ${title} already exists in your catalog.`
        });
        }
        next();
    } catch (err) {
    res.status(500).json({ err: err.message});
    }
};

module.exports = checkDuplicateTitle;