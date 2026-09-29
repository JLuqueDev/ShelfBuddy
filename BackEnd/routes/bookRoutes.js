const express = require('express');
const router = express.Router();
const bookController = require('./../controllers/book.controller')
const { validateBookBody, validateBookId } = require('../middlewares/validateBook.middleware');
const checkDuplicateTitle = require('../middlewares/checkDuplicateTitle.middleware');
const verifyToken = require('./../middlewares/authUser.middleware')

// GET all
router.get('/', verifyToken, bookController.getAllBooks);

// GET a single one
router.get('/:id', verifyToken, validateBookId, bookController.getOneBook);

// POST a book
router.post('/', verifyToken, validateBookBody, checkDuplicateTitle, bookController.createBook);

// PUT to update a book
router.put('/:id', verifyToken, validateBookId, checkDuplicateTitle, bookController.editBook);

// DELETE book
router.delete('/:id', verifyToken, validateBookId, bookController.deleteBook);

module.exports = router;

