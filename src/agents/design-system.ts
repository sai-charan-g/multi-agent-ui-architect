import { runAgent } from './base.js';
import { DesignTokensSchema } from '../schemas/design-system.js';
import type { DesignTokens } from '../schemas/design-system.js';
import type { PlannerOutput } from '../schemas/planner.js';

/**
 * Design System Agent
 *
 * Takes the planner output and generates a complete, coherent design token set
 * covering colors, typography, spacing, borders, shadows, motion, grid, and breakpoints.
 */
export async function runDesignSystemAgent(plan: PlannerOutput): Promise<DesignTokens> {
  return runAgent<DesignTokens>(
    {
      name: 'Design System Agent',
      promptFile: 'design-system',
      knowledgeFiles: ['design', 'spacing', 'typography', 'colors', 'animations'],
      outputSchema: DesignTokensSchema,
      model: 'gemini-2.5-flash',
      temperature: 0.2,
    },
    plan
  );
}
