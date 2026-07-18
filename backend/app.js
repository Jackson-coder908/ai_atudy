require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the AI Study Buddy API',
    endpoints: {
      health: '/health',
      decks: '/api/decks',
      flashcards: '/api/flashcards',
      'research-results': '/api/research-results'
    }
  });
});
app.use('/health', require('./routes/health'));
app.use('/api/decks', require('./routes/decks'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/research-results', require('./routes/researchResults'));
app.use('/api/quiz', require('./routes/quiz'));

// Error Handler Middleware
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
