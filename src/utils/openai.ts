import OpenAI from 'openai';

console.log('API Key:', process.env.NEXT_PUBLIC_OPENAI_API_KEY); // Log the API key

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

export const generateResponse = async (messages: any[], model: string) => {
  try {
    console.log('Generating response with model:', model);
    console.log('Messages:', messages);

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });

    console.log('Response received:', completion);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw new Error('Failed to generate response from OpenAI API');
  }
};