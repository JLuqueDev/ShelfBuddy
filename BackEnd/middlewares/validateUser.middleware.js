const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('User validation error', errors.array());
        return res.status(400).json({ errors: errors.array()});
    } 
    next();
};

const validateRegister = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username Requiered')
        .isLength({min:3}).withMessage('Username must be at least 3 characters long'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email Requiered')
        .isEmail().withMessage('Must be a valid email address format'),
    body('password')
        .notEmpty().withMessage('Password required')
        .isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

const validateLogin = [
    body('identifier')
        .trim()
        .notEmpty().withMessage('Please type your username or email'),
    body('password')
        .notEmpty().withMessage('Password required'),
    handleValidationErrors
];

module.exports = {
    validateLogin,
    validateRegister
};