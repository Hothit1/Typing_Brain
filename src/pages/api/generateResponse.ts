import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
  console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
  console.log('NODE_ENV:', process.env.NODE_ENV);

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in the environment variables');
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in the environment variables');
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { messages, model } = req.body;
    console.log('Received request:', { model, messageCount: messages.length });

    if (!messages || !model) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    let response;
    if (model === 'gpt-4o-mini') {
      console.log('Using gpt-4o-mini model');
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',  // Note: Replace 'gpt-4' with 'gpt-4o-mini' when it becomes available
        messages: messages,
      });
      response = { response: completion.choices[0].message.content };
    } else if (model === 'dalle-3') {
      console.log('Using DALL-E 3 model');
      const imagePrompt = messages[messages.length - 1].content;
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
      });
      response = { 
        response: "Image generated successfully.", 
        imageUrl: image.data[0].url 
      };
    } else if (model === 'claude-3-sonnet') {
      console.log('Using Claude 3.5 Sonnet model');
      const completion = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
      });
      response = { response: completion.content[0].text };
    } else {
      throw new Error('Invalid model selected');
    }

    console.log('Response generated successfully');
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}