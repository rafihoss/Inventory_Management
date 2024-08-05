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
      const { prompt } = req.body;
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: '256x256',
      });

      res.status(200).json({ imageUrl: response.data.data[0].url });
    } catch (error) {
      console.error('Error generating image from OpenAI:', error);
      res.status(500).json({ error: 'Error generating image from OpenAI', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
