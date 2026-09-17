const express = require('express');
const router = express.Router();
const Book = require('../models/Books');

// GET all
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// POST new book
router.post('/', async (req, res) => {
    try {
        const {title, author, status} = req.body;
        const newBook = new Book({ title, author, status });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// DELETE