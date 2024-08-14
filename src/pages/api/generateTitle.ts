import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the type for a message
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure messages is typed correctly
    const { messages }: { messages: Message[] } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates concise chat titles.' },
        { role: 'user', content: `Generate a short, concise title for this conversation:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}` }
      ],
      max_tokens: 60,
    });

    const title = completion.choices[0].message.content?.trim() || 'New Chat';

    console.log('Generated title:', title);  // Add this log
    res.status(200).json({ title });
  } catch (error) {
    console.error('Error generating title:', error);
    res.status(500).json({ error: 'Failed to generate title' });
  }
}