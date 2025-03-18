const express = require("express");
const OpenAI = require('openai');
const router = express.Router();
const { openai } = require('../lib/ai');
const axios = require('axios');
const { JSDOM } = require('jsdom');

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const messages=[];
    messages.push({ role: 'user', content:`give me keywords about this summary \n${text}` })
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const prompt = `
      You are a resource generator AI that finds and provides **useful resources** related to the given summary.
      
      Based on the summary provided, search for **high-quality** resources such as:
      - **Articles** (Blogs, research papers, tutorials)
      - **Books** (Online books, PDFs, eBooks)
    
      Ensure that you provide **at least 10 resources** across different types, but return more if available.
    
      The output should be **only** a JSON array, with each entry containing:
      - **"type"**: ("article", "book")
      - **"title"**: (The title of the resource)
      - **"link"**: (The direct URL to the resource)

      Please i prefer the resources are in the same language as the summary provided.

      **Do not** add any explanations or extra text—only return the JSON array.
    `;
    messages.push({ role: 'system', content: prompt })

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages,
      response_format: { type: "json_object" }
    });

    const resourcesJson = response.choices[0].message.content;
    const resourcesData = JSON.parse(resourcesJson);

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