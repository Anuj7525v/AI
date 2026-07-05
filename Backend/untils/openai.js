

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getOpenAIAPIResponse(message) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return response.text;
  } catch (error) {
    console.log(error);
    return "Something went wrong!";
  }
}

export default getOpenAIAPIResponse;