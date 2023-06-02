const express = require('express');
const router = express.Router();
const Puzzle = require('../modles/puzzle_modles');
const { authenticateUser } = require('../middleware/authentication');
const mongoose = require('mongoose');
// Get all puzzles
router.get('/', async (req, res) => {
    try {
        const puzzles = await Puzzle.find();
        res.json(puzzles);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new puzzle
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { imageUrl, numberOfPieces } = req.body;
        const createdBy = req.user.id;
        console.log(createdBy);

        // Validate the numberOfPieces field
        if (!Number.isInteger(numberOfPieces) || numberOfPieces <= 0 || numberOfPieces > 500) {
            return res.status(400).json({ error: 'Invalid numberOfPieces value. Please choose a value between 1 and 500.' });
        }

        const puzzle = new Puzzle({
            imageUrl,
            numberOfPieces,
            createdBy,
        });

        await puzzle.save();
        res.status(201).json(puzzle);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a specific puzzle by ID
router.get('/:id', async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.id);
        if (!puzzle) {
            res.status(404).json({ error: 'Puzzle not found' });
        } else {
            res.json(puzzle);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific puzzle
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { imageUrl, numberOfPieces } = req.body;
        const puzzle = await Puzzle.findById(req.params.id);
        if (!puzzle) {
            res.status(404).json({ error: 'Puzzle not found' });
            return;
        }

        if (puzzle.createdBy !== req.user.id) {
            res.status(403).json({ error: 'You are not authorized to update this puzzle' });
            return;
        }

        // Validate the numberOfPieces field
        if (!Number.isInteger(numberOfPieces) || numberOfPieces <= 0 || numberOfPieces > 500) {
            return res.status(400).json({ error: 'Invalid numberOfPieces value. Please choose a value between 1 and 500.' });
        }

        puzzle.imageUrl = imageUrl;
        puzzle.numberOfPieces = numberOfPieces;
        await puzzle.save();

        res.json(puzzle);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific puzzle
// ...

router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.id);
        console.log(puzzle.createdBy);
        if (!puzzle) {
            res.status(404).json({ error: 'Puzzle not found' });
            return;
        }

        if (!puzzle.createdBy.equals(req.user.id)) {
            res.status(403).json({ error: 'You are not authorized to delete this puzzle' });
            return;
        }

        await Puzzle.deleteOne({ _id: puzzle._id });

        res.sendStatus(204);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
