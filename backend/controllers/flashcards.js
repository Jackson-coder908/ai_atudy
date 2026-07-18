const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');

// @desc    Get all flashcards for a deck
// @route   GET /api/decks/:deckId/flashcards
// @access  Public
exports.getFlashcards = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    if (!deckId) {
      return res.status(400).json({ error: 'Please provide a deckId' });
    }

    // Verify deck exists
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const flashcards = await Flashcard.find({ deckId });
    res.status(200).json(flashcards);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a flashcard linked to a deck
// @route   POST /api/decks/:deckId/flashcards
// @access  Public
exports.createFlashcard = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    const { question, answer } = req.body;

    if (!deckId || !question || !answer) {
      return res.status(400).json({ error: 'Please provide question, answer, and deckId' });
    }

    // Verify deck exists
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const flashcard = await Flashcard.create({
      question,
      answer,
      deckId
    });

    res.status(201).json(flashcard);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a flashcard
// @route   PUT /api/flashcards/:id
// @access  Public
exports.updateFlashcard = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    
    // Build update object based on what was provided
    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;

    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.status(200).json(flashcard);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a flashcard
// @route   DELETE /api/flashcards/:id
// @access  Public
exports.deleteFlashcard = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.status(200).json({ success: true, message: 'Flashcard deleted successfully' });
  } catch (error) {
    next(error);
  }
};
