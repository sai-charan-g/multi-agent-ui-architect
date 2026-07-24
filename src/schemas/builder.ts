import { z } from 'zod';

// ─── Generated File Schema ──────────────────────────────────────

export const FileTypeEnum = z.enum([
  'page',
  'component',
  'layout',
  'style',
  'config',
  'utility',
  'type',
]);

export const GeneratedFileSchema = z.object({
  path: z.string().describe('Relative file path, e.g. "src/app/page.tsx"'),
  content: z.string().describe('Complete file content'),
  type: FileTypeEnum.describe('Category of the file'),
});

// ─── Generated Project Schema ───────────────────────────────────

export const GeneratedProjectSchema = z.object({
  files: z.array(GeneratedFileSchema).describe('All generated source files'),
  dependencies: z.record(z.string(), z.string()).describe('npm dependencies with versions'),
  devDependencies: z.record(z.string(), z.string()).describe('npm devDependencies with versions'),
});

export type GeneratedFile = z.infer<typeof GeneratedFileSchema>;
export type GeneratedProject = z.infer<typeof GeneratedProjectSchema>;

// ─── Builder Input (Planner + Tokens + optional critic feedback) ─

export const BuilderInputSchema = z.object({
  plan: z.any().describe('PlannerOutput JSON'),
  designTokens: z.any().describe('DesignTokens JSON'),
  criticFeedback: z.any().optional().describe('CriticReport JSON from previous iteration, if fixing'),
  previousFiles: z.array(GeneratedFileSchema).optional().describe('Previously generated files to fix'),
});

export type BuilderInput = z.infer<typeof BuilderInputSchema>;
