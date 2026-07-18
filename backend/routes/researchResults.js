const express = require('express');
const router = express.Router();
const researcResultController = require('../controllers/researchResults')
const {
  getResearchResults,
  createResearchResult,
  getResearchResult,
  deleteResearchResult
} = require('../controllers/researchResults');

router.route('/')
  .get(getResearchResults)
  .post(createResearchResult);

router.route('/:id')
  .get(getResearchResult)
  .delete(deleteResearchResult);

router.post('/research', researcResultController.researchPipeline);
module.exports = router;
