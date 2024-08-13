import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the absolute path to the public folder
  const publicDir = path.join(process.cwd(), 'public');
  const speechFile = path.join(publicDir, 'speech.mp3');

  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile(speechFile);
}