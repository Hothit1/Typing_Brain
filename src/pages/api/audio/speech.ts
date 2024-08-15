import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the absolute path to the public folder
  const publicDir = path.join(process.cwd(), 'public');
  const speechFile = path.join(publicDir, 'speech.mp3');

  // Check if the file exists
  fs.stat(speechFile, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"'); // Optional: set the filename for download

    // Create a read stream and pipe it to the response
    const readStream = fs.createReadStream(speechFile);
    readStream.pipe(res);
  });
}