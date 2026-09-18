const express = require('express');
const router = express.Router();
const bookController = require('./../controllers/bookController')

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.post('/', bookController.createBook);
router.put('/:id', bookController.editBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;

