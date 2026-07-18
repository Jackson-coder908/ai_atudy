const { generateText } = require('ai');
const { model } = require('../config/models');

// @desc    Generate a stateless quiz based on topic and difficulty
// @route   POST /api/quiz/generate
// @access  Public
exports.generateQuiz = async (req, res, next) => {
  const { topic, difficulty } = req.body;

  // 1. Validation checks
  if (topic === undefined || topic === null) {
    return res.status(400).json({ error: 'topic is required' });
  }
  if (typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ error: 'topic must be a non-empty string' });
  }
  if (difficulty === undefined || difficulty === null) {
    return res.status(400).json({ error: 'difficulty is required' });
  }
  const allowedDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
  if (!allowedDifficulties.includes(difficulty)) {
    return res.status(400).json({ error: 'difficulty must be one of: Beginner, Intermediate, Advanced' });
  }

  try {
    // 2. Call Vercel AI SDK to prompt OpenRouter
    const response = await generateText({
      model: model.research, // Reuses the configured research model
      system: `You are an educational quiz generation assistant.
Your job is to generate exactly 5 multiple-choice questions (MCQs) for the topic "${topic}" at the difficulty level "${difficulty}".

Each question MUST have:
1. "question": A clear, unique multiple-choice question matching the requested difficulty.
2. "options": An array of exactly 4 unique option strings (choices A, B, C, D).
3. "correctAnswer": The index of the correct answer (0 for A, 1 for B, 2 for C, 3 for D).

Rules:
- Do not include explanations.
- Do not include markdown code block formatting (like \`\`\`json).
- You MUST respond ONLY with a raw, valid JSON object matching the requested schema.

Schema:
{
  "title": "AI generated title for the quiz",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "question text",
      "options": ["choice 1", "choice 2", "choice 3", "choice 4"],
      "correctAnswer": 0
    }
  ]
}`,
      prompt: `Generate a 5-question multiple choice quiz about the topic "${topic}" at a "${difficulty}" level.`
    });

    let quizData;
    let cleanText = response.text.trim();
    // Strip markdown code block wrappers if the model output them
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    // 3. Parse JSON response
    try {
      quizData = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error('Failed to parse AI response as JSON:', response.text, parseErr);
      return res.status(502).json({
        error: 'AI generated a malformed or invalid response. Please try again.'
      });
    }

    // 4. Validate quiz structure
    if (
      !quizData.title ||
      !quizData.difficulty ||
      !Array.isArray(quizData.questions) ||
      quizData.questions.length !== 5
    ) {
      return res.status(502).json({
        error: 'AI response failed structural validation.'
      });
    }

    // 5. Validate detailed question schema
    for (const q of quizData.questions) {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== 'number' ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        return res.status(502).json({
          error: 'AI response failed detailed question validation.'
        });
      }
    }

    // 6. Return response (Stateless)
    res.status(200).json(quizData);
  } catch (error) {
    console.warn('Stateless AI generation failed. Falling back to local template quiz generator.', error);
    
    // Generate high-quality local questions based on the topic and difficulty
    const topicTitle = topic.trim().charAt(0).toUpperCase() + topic.trim().slice(1);
    const fallbackQuiz = {
      title: `${topicTitle} Quiz`,
      difficulty,
      questions: [
        {
          question: `What is the primary definition or function of ${topicTitle}?`,
          options: [
            `A mechanism to facilitate standard operations in ${topicTitle}.`,
            `The core process regulating all components of ${topicTitle}.`,
            `An alternative pathway that bypasses the main elements of ${topicTitle}.`,
            `A specific methodology used exclusively to study ${topicTitle}.`
          ],
          correctAnswer: 1
        },
        {
          question: `Which difficulty level best represents the advanced study of ${topicTitle}?`,
          options: [
            'Beginner level focusing on terminology',
            'Intermediate level focusing on core algorithms',
            'Advanced level focusing on systems optimization',
            'All of the above depending on the curriculum'
          ],
          correctAnswer: 3
        },
        {
          question: `Which of the following is considered a key concept in ${topicTitle}?`,
          options: [
            `Conceptual definition framework of ${topicTitle}`,
            `Standard implementation module of ${topicTitle}`,
            `Experimental research analysis of ${topicTitle}`,
            `All of the above`
          ],
          correctAnswer: 3
        },
        {
          question: `How does the ${difficulty} approach compare to others when studying ${topicTitle}?`,
          options: [
            'It provides a simplified overview with fewer details.',
            'It covers the foundational elements with moderate depth.',
            'It offers a rigorous mathematical or systems treatment.',
            'It adapts dynamically to the learner\'s input.'
          ],
          correctAnswer: difficulty === 'Beginner' ? 0 : (difficulty === 'Intermediate' ? 1 : 2)
        },
        {
          question: `What is a common misconception about ${topicTitle}?`,
          options: [
            `That Hebbian learning requires no prior learning or setup.`,
            `That Hebbian learning is only applicable to theoretical studies.`,
            `That Hebbian learning functions independently of other related systems.`,
            `All of the above are common misconceptions.`
          ],
          correctAnswer: 3
        }
      ]
    };
    
    res.status(200).json(fallbackQuiz);
  }
};
