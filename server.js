require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(express.json());

// Routes
const usersRoutes = require('./routes/users');
const puzzlesRoutes = require('./routes/puzzles');
app.use('/api/users', usersRoutes);
app.use('/api/puzzles', puzzlesRoutes);

// Default screen path
app.get('/', (req, res) => {
  res.send('Welcome to the PuzzleLuck backend screen!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
