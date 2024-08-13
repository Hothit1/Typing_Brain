import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';

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

        const audioFile = files.audio[0];
        const audioBuffer = fs.readFileSync(audioFile.filepath);

        const transcription = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: audioBuffer,
        });

        res.status(200).json({ text: transcription.text });
    });
}