// @desc    Get health status
// @route   GET /health
// @access  Public
exports.getHealth = (req, res, next) => {
  res.status(200).json({ status: 'ok' });
};
