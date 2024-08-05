// import dotenv from 'dotenv';
// dotenv.config();
// import OpenAI from 'openai';

// // Initialize OpenAI client with the API key from .env file
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function main() {
//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
//       model: 'gpt-4o-mini',
//     });

//     console.log(completion.choices[0].message.content);
//   } catch (error) {
//     console.error('Error fetching completion from OpenAI:', error);
//   }
// }

// main();

// export {openai}

import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages } = req.body;
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });
      res.status(200).json({ result: response.data.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching completion from OpenAI', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}





