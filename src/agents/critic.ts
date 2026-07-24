import { runAgent } from './base.js';
import { CriticReportSchema } from '../schemas/critic.js';
import type { CriticReport } from '../schemas/critic.js';
import type { GeneratedProject } from '../schemas/builder.js';
import type { DesignTokens } from '../schemas/design-system.js';

/**
 * Critic Agent
 *
 * Reviews generated code for quality issues. Never writes code — only identifies
 * problems and recommends fixes. Checks spacing, typography, alignment,
 * responsiveness, accessibility, contrast, hierarchy, and consistency.
 *
 * Pass threshold: score >= 8 AND zero critical/major issues.
 */
export async function runCriticAgent(
  project: GeneratedProject,
  designTokens?: DesignTokens
): Promise<CriticReport> {
  return runAgent<CriticReport>(
    {
      name: 'Critic Agent',
      promptFile: 'critic',
      knowledgeFiles: [
        'design',
        'spacing',
        'typography',
        'colors',
        'animations',
        'components',
        'responsive',
        'accessibility',
        'tailwind',
        'frontend-guidelines',
      ],
      outputSchema: CriticReportSchema,
      model: 'gemini-2.5-flash',
      temperature: 0.2,
    },
    { files: project.files, designTokens }
  );
}
