import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()

const geminiApi = process.env.GEMINI_API_KEY
const geminiModels = process.env.GEMINI_MODEL

const ai = new GoogleGenAI({
  apiKey: geminiApi,
});

export const generateRespon = async (prompts, instructions) => {
  const response = await ai.models.generateContent({
    model: geminiModels,
    contents: prompts,
    config: {
      systemInstruction: instructions,
    },
  });
  return response.text
}

export const randomPrompt = async (prompt) => {
  return await prompt[Math.floor(Math.random() * prompt.length)];
}