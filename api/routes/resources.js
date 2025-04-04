const express = require("express");
const OpenAI = require('openai');
const router = express.Router();
const { openai } = require('../lib/ai');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const History = require('../models/chatHistory');


router.post('/', async (req, res) => {
  try {
    const { text, pdfId } = req.body;
    const messages=[];
    messages.push({ role: 'user', content:`give me keywords about this summary \n${text}` })
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const prompt = `
      You are a resource generator AI that finds and provides **useful resources** related to the given summary.
      
      Output **only** a valid JSON array (no extra text). Each item should be:
      - **"type"**: ("article", "book")
      - **"title"**: (The title of the resource)
      - **"link"**: (A valid direct URL)

      Example output:
      [
        { "type": "article", "title": "Intro to AI", "link": "https://example.com" },
        { "type": "book", "title": "AI for Beginners", "link": "https://example.com" }
      ]

      Please ensure the resources are in the same language as the summary provided.
      **Only return the JSON array**.
    `;
    messages.push({ role: 'system', content: prompt })

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
      response_format: { type: "json_object" }
    });

    const resourcesJson = response.choices[0].message.content;
    const cleanedJson = resourcesJson.replace(/```json|```/g, '').trim();
    const resourcesData = JSON.parse(cleanedJson);

    const newResources = resourcesData.map(resource => ({
      type: resource.type,
      title: resource.title,
      link: resource.link
    }));
    
    await History.updateOne(
      { pdfId },
      { $set: { resources: newResources } }
    );

    return res.status(200).json(resourcesData);
  } catch (error) {
    console.error('Error generating resources:', error);
    res.status(500).json({ 
      error: 'Failed to generate resources',
      details: error.message
    });
  }
});

router.get('/metadata', async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // Fetch the page content using axios
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    
    // Parse the HTML response with JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract metadata (like the OpenGraph image)
    const metadata = {
      image: document.querySelector('meta[property="og:image"]')?.content || 'No image found',
      title: document.title || 'No title found',
      description: document.querySelector('meta[name="description"]')?.content || 'No description found',
    };

    // Send the metadata as a JSON response
    res.json(metadata);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

module.exports = router;