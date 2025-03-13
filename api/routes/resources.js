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
      You are a resource generator AI that provides helpful links for these topics ${text} . For each query, search for relevant resources, such as articles, tutorials, and documentation, and provide them in the following format: {\"link\": \"[URL]\"}. The output should only contain links and no additional explanations.
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