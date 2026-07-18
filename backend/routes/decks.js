const express = require('express');
const router = express.Router();
const {
  getDecks,
  createDeck,
  getDeck,
  updateDeck,
  deleteDeck
} = require('../controllers/decks');

// Re-route into other resource routers
const flashcardRouter = require('./flashcards');
router.use('/:deckId/flashcards', flashcardRouter);

router.route('/')
  .get(getDecks)
  .post(createDeck);

router.route('/:id')
  .get(getDeck)
  .put(updateDeck)
  .delete(deleteDeck);

module.exports = router;
