import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from '@ai-sdk/openai';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { audio } = req.body; // Expect an audio file (base64 encoded or URL)

      // Transcribe the audio with Whisper
      const response = await openai.audio.transcribe(audio, {
        model: 'whisper-1', // Choose a Whisper model (check OpenAI docs for options)
        language: 'en',  // Set the language for transcription (optional)
        // Other parameters like temperature, etc. can be set here
      });

      // Respond with the transcription
      res.status(200).json({ transcription: response.text });
    } catch (error) {
      console.error('Whisper transcription error:', error);
      res.status(500).json({ error: 'Failed to transcribe audio.' });
    }
  } else {
    res.status(405).end('Method Not Allowed'); 
  }
}