const mongoose = require('mongoose');

const ResearchResultSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Please add a topic']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user ID']
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResearchResult', ResearchResultSchema);
