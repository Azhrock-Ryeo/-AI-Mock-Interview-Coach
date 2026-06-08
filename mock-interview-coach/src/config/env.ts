export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

if (!GROQ_API_KEY) {
  console.warn('⚠️ VITE_GROQ_API_KEY is not set in your .env file!')
}