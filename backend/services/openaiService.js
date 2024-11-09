const OpenAI = require("openai");

require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateResponse(prompt, model = 'gpt-4o-mini') {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    })
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error in OpenAI API:', error)
    throw new Error('Failed to generate a response')
  }
}

module.exports = { generateResponse }
