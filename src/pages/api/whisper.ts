import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from '@ai-sdk/openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { audio } = req.body; // Expect an audio file (base64 encoded or URL)

      // Ensure audio is provided
      if (!audio) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      // If audio is a file path, create a readable stream
      const audioStream = fs.createReadStream(audio); // Adjust this if audio is base64 or URL

      // Transcribe the audio with Whisper
      const response = await openai.transcriptions.create({
        model: 'whisper-1', // Choose a Whisper model (check OpenAI docs for options)
        file: audioStream, // Pass the readable stream
        language: 'en',  // Set the language for transcription (optional)
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