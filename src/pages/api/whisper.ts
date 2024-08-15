import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { audio } = req.body; // Expect an audio file path

      // Ensure audio is provided
      if (!audio) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      // Read the file and create a File object
      const audioFile = fs.readFileSync(audio);
      const fileName = path.basename(audio);
      const file = new File([audioFile], fileName, { type: 'audio/mpeg' });

      // Transcribe the audio with Whisper
      const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: file,
        language: 'en',
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