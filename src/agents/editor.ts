import { runAgent } from './base.js';
import { z } from 'zod';
import { GeneratedFileSchema } from '../schemas/builder.js';
import type { GeneratedFile } from '../schemas/builder.js';
import type { CriticReport } from '../schemas/critic.js';

const EditorOutputSchema = z.object({
  files: z.array(GeneratedFileSchema).describe('The files that were modified or newly created.'),
});

type EditorOutput = z.infer<typeof EditorOutputSchema>;

export interface EditorInput {
  prompt: string;
  currentFiles: GeneratedFile[];
  images?: { data: string; mimeType: string; name: string }[];
  criticReport?: CriticReport;
}

/**
 * Editor Agent
 * Takes an existing project and a user prompt, and returns the modified files.
 */
export async function runEditorAgent(input: EditorInput): Promise<EditorOutput> {
  const model = process.env.BUILDER_MODEL ?? 'gemini-2.5-flash';
  const { images, ...restInput } = input;

  return runAgent<EditorOutput>(
    {
      name: 'Frontend Editor Agent',
      promptFile: 'editor',
      knowledgeFiles: ['frontend-guidelines', 'tailwind', 'interactive-editing'],
      outputSchema: EditorOutputSchema,
      model,
      temperature: 0.2,
      maxRetries: 2,
    },
    restInput,
    images ? images.map(img => ({ data: img.data, mimeType: img.mimeType })) : undefined
  );
}
