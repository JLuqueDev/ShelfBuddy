const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user.controller');
const {validateLogin, validateRegister} = require('./../middlewares/validateUser.middleware');

// to register new user
router.post('/register', validateRegister, userController.register);

// to log in an existing user
router.post('/login', validateLogin, userController.login);

module.exports = router;