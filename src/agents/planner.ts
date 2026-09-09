import { runAgent } from './base.js';
import { PlannerOutputSchema } from '../schemas/planner.js';
import type { PlannerInput, PlannerOutput } from '../schemas/planner.js';

/**
 * Planner Agent
 *
 * Understands the user's request and produces a structured design brief
 * including website type, style, pages, sections, CTAs, and design direction.
 */
export async function runPlannerAgent(input: PlannerInput): Promise<PlannerOutput> {
  return runAgent<PlannerOutput>(
    {
      name: 'Planner Agent',
      promptFile: 'planner',
      knowledgeFiles: ['design', 'components', 'industry-blueprints'],
      outputSchema: PlannerOutputSchema,
      model: 'gemini-2.5-flash',
      temperature: 0.4,
    },
    input
  );
}
