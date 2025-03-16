const { OpenAI } = require('openai');

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY
});

module.exports = {openai};