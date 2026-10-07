const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true},
    author: { type: String, required: true},
    status: {
        type: String,
        required: true,
        enum: ['To read', 'Reading', 'Finished'],
        default: 'To read'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps:true});

// for each book title to be unique per user
bookSchema.index({ title: 1, user: 1}, {unique: true});

module.exports = mongoose.model('Book', bookSchema);