const express = require('express');
const app = express();
require('dotenv').config()

const PORT = process.env.PORT

app.use(express.static('public'));

app.listen(PORT, () => {
    try {
        console.log(`Server connected successfully to port: ${PORT}`)
    } catch (error) {
        console.log(`Error connectiong to Node, Error: ${error.message}`);
        
    }
    
})