const { body, param, validationResult } = require('express-validator');

// to handle validation errors
const handleValidationErrors = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
    } 
    next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Validation for creating/editing books
const validateBookBody = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({min:2}).withMessage('Title must be at least 2 characters long'),
    body('author')
        .trim()
        .notEmpty().withMessage('Author is required'),
    body('status')
        .optional()
        .isIn(['To Read', 'Reading', 'Finished'])
        .withMessage('Status must be either: To Read, Reading, or Completed'),
    handleValidationErrors
];

// validation for routes with :id
const validateBookId = [
    param('id')
    .isMongoId().withMessage('Invalid ID format'),
    handleValidationErrors
];

module.exports = {
    validateBookBody,
    validateBookId
};