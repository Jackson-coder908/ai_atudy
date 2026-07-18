const Deck = require('../models/Deck');

// @desc    Get all Decks for a User
// @route   GET /api/decks
// @access  Public
exports.getDecks = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Please provide a userId' });
    }
    const decks = await Deck.find({ userId });
    res.status(200).json(decks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Deck
// @route   POST /api/decks
// @access  Public
exports.createDeck = async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Please provide name and userId' });
    }
    const deck = await Deck.create({ name, userId });
    res.status(201).json(deck);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single Deck
// @route   GET /api/decks/:id
// @access  Public
exports.getDeck = async (req, res, next) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Deck name
// @route   PUT /api/decks/:id
// @access  Public
exports.updateDeck = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Please provide a name to update' });
    }
    const deck = await Deck.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Deck
// @route   DELETE /api/decks/:id
// @access  Public
exports.deleteDeck = async (req, res, next) => {
  try {
    const deck = await Deck.findByIdAndDelete(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json({ success: true, message: 'Deck deleted successfully' });
  } catch (error) {
    next(error);
  }
};
