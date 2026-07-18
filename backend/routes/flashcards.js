const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard
} = require('../controllers/flashcards');

router.route('/')
  .get(getFlashcards)
  .post(createFlashcard);

router.route('/:id')
  .put(updateFlashcard)
  .delete(deleteFlashcard);

module.exports = router;
