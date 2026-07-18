const { runResearchAgent } = require('../agents/researchAgent');
const { runWriterAgent } = require('../agents/writerAgent');
const { runReviewerAgent } = require('../agents/reviewerAgent');

async function runResearchPipeline(topic) {
  const researchNotes = await runResearchAgent(topic);
  const draft = await runWriterAgent(topic, researchNotes);
  const reviewResult = await runReviewerAgent(topic, researchNotes, draft);

  return {
    topic,
    researchNotes,
    draft,
    reviewResult
  };
}

module.exports = { runResearchPipeline };