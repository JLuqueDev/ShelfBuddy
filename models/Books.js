const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { type: string, required: true},
    author: { type: string, required: true},
    status: {
        type: string,
        enum: ['To read', 'Reading', 'Finished'],
        default: 'To read'
    }
}, {timestamps:true});

module.exports = mongoose.model('Books', bookSchema);