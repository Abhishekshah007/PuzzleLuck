const express = require('express');
const router = express.Router();
const User = require('../modles/user_modles');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    try {
        // Extract user input from request body
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Check if the username or email is already registered
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ error: 'Username or email is already registered' });
        }

        // Create a new user instance
        const user = new User({ username, email, password });

        // Save the user to the database
        await user.save();

        // Generate JWT
        const token = generateToken(user);

        // Return success response with JWT
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        // Extract user input from request body
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Find the user by username
        const user = await User.findOne({ username });

        // Check if the user exists and the password is correct
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT
        const token = generateToken(user);

        // Return success response with JWT
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User logout (JWT can be invalidated on the client-side)

module.exports = router;

// Function to generate JWT
function generateToken(user) {
    const payload = { id: user.id };
    console.log(payload.id);
    const secretKey = process.env.JWT_SECRET; // Replace with your secret key
    const options = { expiresIn: '10d' }; // Adjust the expiration time as needed
    return jwt.sign(payload, secretKey, options);
}
