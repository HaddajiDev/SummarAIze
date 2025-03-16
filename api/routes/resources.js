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
    const messages=[];
    messages.push({ role: 'user', content:`give me keywords about this summary \n${text}` })
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const prompt = `
      You are a resource generator AI that provides helpful links for the keywords you provided  . For each query, search for relevant resources, such as articles, tutorials, and documentation, and provide them in the following format: {\"link\": \"[URL]\"}. The output should only contain links and no additional explanations.
    `;
    messages.push({ role: 'system', content: prompt })

    const response = await openrouter.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages,
      response_format: { type: "json_object" }
    });

    const resourcesJson = response.choices[0].message.content;
    const resourcesData = JSON.parse(resourcesJson);

    res.json({data:resourcesData});
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      details: error.message
    });
  }
});

module.exports = router;