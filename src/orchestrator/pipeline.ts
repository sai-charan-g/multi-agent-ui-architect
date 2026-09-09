import { runPlannerAgent } from '../agents/planner.js';
import { runDesignSystemAgent } from '../agents/design-system.js';
import { runBuilderAgent } from '../agents/builder.js';
import { runCriticAgent } from '../agents/critic.js';
import { writeProject } from '../lib/file-writer.js';
import { saveOrUpdateProjectInDb } from '../db/project-service.js';
import { log } from '../lib/logger.js';
import type { PlannerInput, PlannerOutput } from '../schemas/planner.js';
import type { DesignTokens } from '../schemas/design-system.js';
import type { GeneratedProject } from '../schemas/builder.js';
import type { CriticReport } from '../schemas/critic.js';

export interface PipelineOptions {
  /** Max critic → fix iterations */
  maxCriticLoops?: number;
  /** Project name for output directory */
  projectName?: string;
}

export interface PipelineResult {
  plan: PlannerOutput;
  designTokens: DesignTokens;
  project: GeneratedProject;
  criticReport: CriticReport;
  outputDir: string;
  iterations: number;
}

/**
 * Run the full agent pipeline:
 * Planner → Design System → Builder → Critic (→ Fix loop) → Output
 */
export async function runPipeline(
  userRequest: string,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const { maxCriticLoops = 3 } = options;
  const pipelineStart = Date.now();

  log.divider();
  log.info('Starting AI Frontend Designer Pipeline');
  log.info(`Request: "${userRequest}"`);
  log.divider();

  // ─── Step 1: Planner ────────────────────────────────────────
  log.step(1, 5, '🧠 Planner Agent — analyzing request');
  const plannerInput: PlannerInput = {
    userRequest,
    constraints: [],
  };
  const plan = await runPlannerAgent(plannerInput);
  log.success(`Plan created: ${plan.websiteType} / ${plan.style} / ${plan.pages.length} pages / ${plan.sections.length} sections`);

  // ─── Step 2: Design System ──────────────────────────────────
  log.step(2, 5, '🎨 Design System Agent — generating tokens');
  const designTokens = await runDesignSystemAgent(plan);
  log.success(`Design tokens generated: ${plan.style} style, font: ${designTokens.typography.fontFamily.heading}`);

  // ─── Step 3: Builder ────────────────────────────────────────
  log.step(3, 5, '🔨 Frontend Builder — generating code');
  let project = await runBuilderAgent(plan, designTokens);
  log.success(`Code generated: ${project.files.length} files`);

  // ─── Step 4: Critic Loop ────────────────────────────────────
  let criticReport: CriticReport;
  let iterations = 0;

  for (let i = 0; i < maxCriticLoops; i++) {
    iterations = i + 1;
    log.step(4, 5, `🔍 Critic Agent — review iteration ${iterations}/${maxCriticLoops}`);

    criticReport = await runCriticAgent(project, designTokens);

    log.info(`Critic score: ${criticReport.overallScore}/10`, {
      issues: criticReport.issues.length,
      critical: criticReport.issues.filter((i) => i.severity === 'critical').length,
      major: criticReport.issues.filter((i) => i.severity === 'major').length,
    });

    if (criticReport.passed) {
      log.success(`✅ Critic PASSED on iteration ${iterations} (score: ${criticReport.overallScore}/10)`);
      break;
    }

    if (i < maxCriticLoops - 1) {
      log.warn(`Critic found ${criticReport.issues.length} issues. Sending back to Builder for fixes...`);
      log.step(4, 5, `🔧 Fixing issues (iteration ${iterations})`);
      project = await runBuilderAgent(plan, designTokens, criticReport, project.files);
      log.success(`Code updated: ${project.files.length} files`);
    } else {
      log.warn(`Max iterations reached. Proceeding with current output (score: ${criticReport.overallScore}/10).`);
    }
  }

  criticReport = criticReport!;

  // ─── Step 5: Write Output ───────────────────────────────────
  const projectName = options.projectName ?? slugify(plan.brandName);
  log.step(5, 5, `📁 Writing project to output/${projectName}/`);
  const outputDir = writeProject(project, projectName);

  // Persist project & files to MongoDB
  await saveOrUpdateProjectInDb({
    name: projectName,
    prompt: userRequest,
    plan,
    designTokens,
    project,
    criticReport,
    status: 'completed',
  });

  log.divider();
  log.timing('Total pipeline', pipelineStart);
  log.success(`🎉 Project ready at: ${outputDir}`);
  log.info('Next steps: cd into the project, run `npm install`, then `npm run dev`');
  log.divider();

  return {
    plan,
    designTokens,
    project,
    criticReport,
    outputDir,
    iterations,
  };
}

/** Convert a string to a URL-safe slug */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
