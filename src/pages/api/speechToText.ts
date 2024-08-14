import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';
import FormData from 'form-data';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing the file' });
        }

        // Check if audio files are present
        if (!files.audio || !Array.isArray(files.audio) || files.audio.length === 0) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        const audioFile = files.audio[0];
        const audioBuffer = fs.readFileSync(audioFile.filepath);

        try {
            // Create a FormData instance
            const formData = new FormData();
            formData.append('file', audioBuffer, {
                filename: audioFile.originalFilename || 'audio.mp3', // Use the original filename or a default
                contentType: 'audio/mpeg', // Set the content type
            });

            const transcription = await openai.audio.transcriptions.create({
                model: "whisper-1",
                file: formData, // Pass the FormData instance
            });

            res.status(200).json({ text: transcription.text });
        } catch (error) {
            console.error('Error during transcription:', error);
            res.status(500).json({ error: 'Failed to transcribe audio.' });
        }
    });
}