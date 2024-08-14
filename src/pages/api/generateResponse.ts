import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { IncomingForm, Files, Fields, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
  console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Not set');
  console.log('NODE_ENV:', process.env.NODE_ENV);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const form = new IncomingForm();
  
  form.parse(req, async (err: Error, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set in the environment variables');
      }
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set in the environment variables');
      }
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set in the environment variables');
      }

      const { messages, model, addon, detachImage } = JSON.parse(fields.data as string);
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      console.log('Received request:', { model, addon, messageCount: messages.length, hasImage: !!imageFile, detachImage });

      if (!messages || !model) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      let response;
      if (addon === 'dalle') {
        response = await handleDalle(messages);
      } else if (addon === 'tts') {
        response = await handleTTS(messages);
      } else if (model === 'gpt-4o-mini') {
        response = await handleGPT4(messages, imageFile, detachImage);
      } else if (model === 'claude-3-opus-20240229') {
        response = await handleClaudeVision(messages, imageFile);
      } else if (model === 'claude-3-sonnet') {
        response = await handleClaudeSonnet(messages);
      } else if (model === 'llama-3.1-70b-versatile') {
        response = await handleGroq(messages);
      } else {
        throw new Error('Invalid model or addon selected');
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
  });
}

async function handleDalle(messages: any[]) {
  console.log('Using DALL-E 3 addon');
  const imagePrompt = messages[messages.length - 1].content;
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: imagePrompt,
    n: 1,
    size: "1024x1024",
  });
  return { 
    response: "Image generated successfully.", 
    imageUrl: image.data[0].url 
  };
}

async function handleTTS(messages: any[]) {
  console.log('Using TTS addon');
  const inputText = messages[messages.length - 1].content;
  console.log('Input text for TTS:', inputText);

  const publicDir = path.join(process.cwd(), 'public');
  const speechFile = path.join(publicDir, 'speech.mp3');

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: inputText,
  });

  console.log("TTS API Response:", mp3);

  if (mp3.body instanceof Readable) {
    const chunks = [];
    for await (const chunk of mp3.body) {
      chunks.push(chunk);
    }
    fs.writeFileSync(speechFile, Buffer.concat(chunks));
  } else {
    console.log("Unexpected response format:", typeof mp3.body, mp3.body);
    throw new Error('Unexpected response format from TTS API');
  }

  return {
    response: "Text-to-speech audio generated successfully.",
    audioUrl: `/speech.mp3`,
  };
}

async function handleGPT4(messages: any[], imageFile: File | undefined, detachImage: boolean) {
  console.log('Using GPT-4o-mini model');
  let visionMessages;
  let model = 'gpt-4o-mini'; // Set to gpt-4o-mini for both text and vision

  if (imageFile && !detachImage) {
    const base64Image = fs.readFileSync(imageFile.filepath, { encoding: 'base64' });
    const lastMessage = messages[messages.length - 1];
    visionMessages = messages.slice(0, -1);
    visionMessages.push({
      role: 'user',
      content: [
        { type: 'text', text: lastMessage.content },
        { 
          type: 'image_url', 
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`
          }
        }
      ]
    });
  } else {
    visionMessages = messages;
  }

  const completion = await openai.chat.completions.create({
    model: model,
    messages: visionMessages,
    max_tokens: 500,
  });
  return { response: completion.choices[0].message.content };
}

async function handleClaudeVision(messages: any[], imageFile: File | undefined) {
  if (!imageFile) {
    throw new Error('No image file provided');
  }
  const base64Image = fs.readFileSync(imageFile.filepath, { encoding: 'base64' });
  const lastMessage = messages[messages.length - 1];
  const visionMessages = messages.slice(0, -1).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  visionMessages.push({
    role: 'user',
    content: [
      { type: 'text', text: lastMessage.content },
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } }
    ]
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: visionMessages,
  });
  return { response: response.content[0].text };
}

async function handleClaudeSonnet(messages: any[]) {
  console.log('Using Claude 3.5 Sonnet model');
  const completion = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    messages: messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
  });
  return { response: completion.content[0].text };
}

async function handleGroq(messages: any[]) {
  console.log('Using Groq llama-3.1-70b-versatile');
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: messages,
  });
  return { response: completion.choices[0].message.content };
}