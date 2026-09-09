import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { z } from 'zod';
import type { ZodTypeAny } from 'zod';
import { generateStructuredOutput } from '../lib/gemini.js';
import { loadKnowledge } from '../lib/knowledge-loader.js';
import { log } from '../lib/logger.js';

const PROMPTS_DIR = resolve(process.cwd(), 'src', 'prompts');

export interface AgentConfig<TOutput> {
  /** Agent name for logging */
  name: string;
  /** Prompt file name (without .md extension) */
  promptFile: string;
  /** Knowledge files this agent needs */
  knowledgeFiles: string[];
  /** Zod schema for output validation */
  outputSchema: ZodTypeAny;
  /** Gemini model to use */
  model?: string;
  /** Temperature (0-1) */
  temperature?: number;
  /** Max retries on validation failure */
  maxRetries?: number;
}

/**
 * Run a single agent with structured output.
 * Loads prompt + knowledge, calls Gemini, validates with Zod.
 */
export async function runAgent<TOutput>(
  config: AgentConfig<TOutput>,
  input: unknown,
  images?: { data: string; mimeType: string }[]
): Promise<TOutput> {
  const {
    name,
    promptFile,
    knowledgeFiles,
    outputSchema,
    model = 'gemini-2.5-flash',
    temperature = 0.3,
    maxRetries = 2,
  } = config;

  log.agent(`Running ${name}...`, { model });

  // Load prompt
  const promptPath = join(PROMPTS_DIR, `${promptFile}.md`);
  let prompt: string;
  try {
    prompt = readFileSync(promptPath, 'utf-8');
  } catch {
    throw new Error(`Prompt file not found: ${promptPath}`);
  }

  // Load knowledge
  const knowledge = loadKnowledge(knowledgeFiles);

  // Build system prompt
  const systemPrompt = `${prompt}\n\n# KNOWLEDGE BASE\n${knowledge}`;

  // Convert Zod schema to JSON Schema for Gemini.
  // Zod 4 ships a native `z.toJSONSchema` helper; the older
  // `zod-to-json-schema` package only understands Zod 3 internals and
  // silently returns an empty schema when handed a Zod 4 schema, which
  // causes Gemini to emit free-form JSON that fails the Zod parse on
  // the way back (this is the source of the recurring
  // "expected object, received string" / "Invalid option" errors).
  const responseSchema = z.toJSONSchema(outputSchema, {
    target: 'jsonSchema7',
  }) as Record<string, unknown>;
  // Strip the `$schema` meta key — Gemini's `responseSchema` rejects
  // unknown meta keys and the draft URL is not needed in the payload.
  delete (responseSchema as Record<string, unknown>).$schema;

  // Retry loop
  let lastError: Error | null = null;

  const effectiveRetries = Math.max(maxRetries, 3);
  for (let attempt = 1; attempt <= effectiveRetries; attempt++) {
    const startMs = Date.now();

    try {
      const rawOutput = await generateStructuredOutput({
        model,
        systemPrompt,
        userPrompt: JSON.stringify(input, null, 2),
        images,
        responseSchema,
        temperature,
      });

      log.timing(`${name} API call (attempt ${attempt})`, startMs);

      // Parse and validate
      const parsed = JSON.parse(rawOutput);
      const validated = outputSchema.parse(parsed) as TOutput;

      log.success(`${name} completed successfully`);
      return validated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      log.warn(`${name} attempt ${attempt}/${effectiveRetries} failed: ${lastError.message}`);

      if (attempt < effectiveRetries) {
        const delayMs = attempt * 2500;
        log.info(`Retrying ${name} in ${delayMs / 1000}s (waiting out demand spike)...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  throw new Error(`${name} failed after ${effectiveRetries} attempts: ${lastError?.message}`);
}
