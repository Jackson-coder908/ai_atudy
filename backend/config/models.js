const { createOpenRouter } = require('@openrouter/ai-sdk-provider');

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});
const model = {
    research: openRouter('meta-llama/llama-3.2-3b-instruct'),
    writer: openRouter('openai/gpt-oss-20b'),
    reviewer: openRouter('google/gemma-4-26b-a4b-it')
}
module.exports = { openRouter, model }
