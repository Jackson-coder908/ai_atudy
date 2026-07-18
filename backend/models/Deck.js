const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a deck name']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user ID']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Deck', DeckSchema);
