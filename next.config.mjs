/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net',
      'dalleproduse.blob.core.windows.net',
      'openai-labs-public-images-prod.azureedge.net'
    ],
  },
};

export default nextConfig;