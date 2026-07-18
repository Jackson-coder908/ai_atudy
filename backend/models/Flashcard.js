const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question']
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer']
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: [true, 'Please add a deck ID']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);
