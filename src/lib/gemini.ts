import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getAI() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
}

export const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  lite: "gemini-3.1-flash-lite-preview",
  image: "gemini-3.1-flash-image-preview",
  tts: "gemini-2.5-flash-preview-tts",
  live: "gemini-3.1-flash-live-preview",
};
