const express = require("express");
const OpenAI = require('openai');
const router = express.Router();


const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const prompt = `
      Generate a quiz based on the following text. Follow these requirements:
      - Create 5 multiple-choice questions
      - Each question should have 4 options
      - Indicate the correct answer with an index (0-3)
      - Format the response as a valid JSON array only
      - No additional text or explanation
      - Use this structure:
        [{
          "question": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "answer": correct_option_index
        }]

      Text: ${text}
    `;

    const response = await openrouter.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const quizJson = response.choices[0].message.content;
    const quizData = JSON.parse(quizJson);

    res.json(quizData);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      details: error.message
    });
  }
});

module.exports = router;