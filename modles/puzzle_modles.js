const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    numberOfPieces: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

module.exports = Puzzle;
