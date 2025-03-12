const express = require("express");
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY
});

const systemPrompt = "your are a helpfull assistant"

router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ];

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: messages,
        });

        console.log("AI : ", completion.choices[0].message.content)
        res.send({ response: completion.choices[0].message.content });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error });
    }
});

module.exports = router;
