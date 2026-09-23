// dependencies access
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bookRoutes = require('./routes/bookRoutes')
const userRoutes = require('./routes/userRoutes');

// global middlewares
app.use(express.json());
app.use(express.static('public'));

// database conection 
const dbConnection = require('./config/db');

// user routes
app.use('/api/users', userRoutes);

// book routes
app.use('/api/books', bookRoutes);

// PORT connction
const PORT = process.env.PORT;
app.listen(PORT, () => {
    try {
        console.log(`Connected successfully to port: ${PORT}`);
    } catch (error) {
        console.log(`Error connectiong to PORT, Error: ${error.message}`);   
    }  
})