import { runAgent } from './base.js';
import { GeneratedProjectSchema } from '../schemas/builder.js';
import type { GeneratedProject, BuilderInput } from '../schemas/builder.js';
import type { PlannerOutput } from '../schemas/planner.js';
import type { DesignTokens } from '../schemas/design-system.js';
import type { CriticReport } from '../schemas/critic.js';

/**
 * Frontend Builder Agent
 *
 * Takes the planner output + design tokens and generates production-quality
 * React/Next.js code with proper folder structure, responsive Tailwind,
 * accessibility, and clean component architecture.
 *
 * Can also receive critic feedback to fix issues in a previous iteration.
 */
export async function runBuilderAgent(
  plan: PlannerOutput,
  designTokens: DesignTokens,
  criticFeedback?: CriticReport,
  previousFiles?: GeneratedProject['files']
): Promise<GeneratedProject> {
  const input: BuilderInput = {
    plan,
    designTokens,
    criticFeedback: criticFeedback ?? undefined,
    previousFiles: previousFiles ?? undefined,
  };

  // Builder defaults to 2.5-flash because the free tier has a 0-quota
  // cap on 2.5-pro. Override with BUILDER_MODEL=gemini-2.5-pro (or any
  // other available model) once billing is enabled.
  const model = process.env.BUILDER_MODEL ?? 'gemini-2.5-flash';

  return runAgent<GeneratedProject>(
    {
      name: 'Frontend Builder Agent',
      promptFile: 'builder',
      knowledgeFiles: [
        'frontend-guidelines',
        'components',
        'tailwind',
        'responsive',
        'accessibility',
      ],
      outputSchema: GeneratedProjectSchema,
      model,
      temperature: 0.2,
      maxRetries: 2,
    },
    input
  );
}
