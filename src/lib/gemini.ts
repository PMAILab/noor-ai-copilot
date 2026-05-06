// Gemini AI wrapper for Noor
// Uses @google/genai SDK (already in package.json)

import { GoogleGenAI } from '@google/genai';

// NOTE: In production, the API key must be in VITE_GEMINI_API_KEY env var
// For demo/development, we use mock responses when no key is configured
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
}

export const isGeminiConfigured = (): boolean => !!GEMINI_API_KEY;

/**
 * Generate structured JSON response from Gemini
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  systemInstruction: string,
  options: {
    maxOutputTokens?: number;
    temperature?: number;
    model?: string;
  } = {}
): Promise<T> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const {
    maxOutputTokens = 2000,
    temperature = 0.7,
    model = 'gemini-2.5-pro-preview-05-06',
  } = options;

  const response = await getAI().models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      maxOutputTokens,
      temperature,
    },
  });

  const text = response.text || '';
  try {
    return JSON.parse(text) as T;
  } catch {
    // Strip markdown fences if present
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}

/**
 * Generate plain text response from Gemini
 */
export async function generateText(
  prompt: string,
  systemInstruction: string,
  options: {
    maxOutputTokens?: number;
    temperature?: number;
    model?: string;
  } = {}
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const {
    maxOutputTokens = 500,
    temperature = 0.7,
    model = 'gemini-2.5-pro-preview-05-06',
  } = options;

  const response = await getAI().models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      maxOutputTokens,
      temperature,
    },
  });

  return response.text || '';
}
