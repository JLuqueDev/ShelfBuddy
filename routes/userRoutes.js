const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user.controller');

// to register new user
router.post('/register', userController.register);

// to log in an existing user
router.post('/login', userController.login);

module.exports = router;