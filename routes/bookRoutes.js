const express = require('express');
const router = express.Router();
const bookController = require('./../controllers/bookController')
const { validateBookBody, validateBookId } = require('../middlewares/validateBook');
const checkDuplicateTitle = require('../middlewares/checkDuplicateTitle');

// GET all
router.get('/', bookController.getAllBooks);

// GET a single one
router.get('/:id', validateBookId, bookController.getOneBook);

// POST a book
router.post('/', validateBookBody, checkDuplicateTitle, bookController.createBook);

// PUT to update a book
router.put('/:id', validateBookId, checkDuplicateTitle, bookController.editBook);

// DELETE book
router.delete('/:id', validateBookId, bookController.deleteBook);

module.exports = router;

