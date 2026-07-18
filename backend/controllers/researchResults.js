const ResearchResult = require('../models/ResearchResult');
const { runResearchPipeline } = require('../services/orchestrator');


// @desc    Get all Saved Research Results for a User
// @route   GET /api/research-results
// @access  Public
exports.getResearchResults = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'Please provide a userId' });
    }
    const results = await ResearchResult.find({ userId });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Research Result
// @route   POST /api/research-results
// @access  Public
exports.createResearchResult = async (req, res, next) => {
  try {
    const { topic, content, userId, deckId } = req.body;
    if (!topic || !content || !userId) {
      return res.status(400).json({ error: 'Please provide topic, content, and userId' });
    }
    const result = await ResearchResult.create({
      topic,
      content,
      userId,
      deckId
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single Research Result
// @route   GET /api/research-results/:id
// @access  Public
exports.getResearchResult = async (req, res, next) => {
  try {
    const result = await ResearchResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Research result not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Research Result
// @route   DELETE /api/research-results/:id
// @access  Public
exports.deleteResearchResult = async (req, res, next) => {
  try {
    const result = await ResearchResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Research result not found' });
    }
    res.status(200).json({ success: true, message: 'Research result deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Run research pipeline
// @route   POST /api/research-results/research
// @access  Public
exports.researchPipeline = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic required' });
    }
    const result = await runResearchPipeline(topic);

    res.status(201).json({ succes: true, data: result });

  } catch (error) {
    next(error);
  }
};