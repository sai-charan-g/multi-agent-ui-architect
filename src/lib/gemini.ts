import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

/**
 * Get a singleton Gemini client instance.
 * Reads GEMINI_API_KEY from environment variables.
 */
export function getGeminiClient(): GoogleGenAI {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is required. Set it in your .env file.'
    );
  }

  client = new GoogleGenAI({ apiKey });
  return client;
}

/**
 * Generate structured JSON output from Gemini.
 */
export async function generateStructuredOutput(options: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  images?: { data: string; mimeType: string }[];
  responseSchema: Record<string, unknown>;
  temperature?: number;
}): Promise<string> {
  const ai = getGeminiClient();

  const contents: any[] = [{ text: options.userPrompt }];
  if (options.images && options.images.length > 0) {
    for (const img of options.images) {
      contents.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType,
        }
      });
    }
  }

  const response = await ai.models.generateContent({
    model: options.model,
    contents,
    config: {
      systemInstruction: options.systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: options.responseSchema,
      temperature: options.temperature ?? 0.3,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini returned empty response');
  }

  return text;
}

/**
 * Generate free-form text output from Gemini (for code generation).
 * Uses JSON mode but with a flexible schema for large code outputs.
 */
export async function generateCodeOutput(options: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  responseSchema: Record<string, unknown>;
  temperature?: number;
}): Promise<string> {
  return generateStructuredOutput({
    ...options,
    temperature: options.temperature ?? 0.2,
  });
}
