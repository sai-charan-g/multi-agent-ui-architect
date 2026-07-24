import { z } from 'zod';

// ─── Issue Schema ───────────────────────────────────────────────

export const SeverityEnum = z.enum([
  'critical',
  'major',
  'minor',
  'suggestion',
]);

export const CategoryEnum = z.enum([
  'spacing',
  'typography',
  'alignment',
  'responsiveness',
  'accessibility',
  'contrast',
  'hierarchy',
  'consistency',
  'performance',
  'code_quality',
  'naming',
  'structure',
]);

export const IssueSchema = z.object({
  id: z.string().describe('Unique issue identifier, e.g. "SPACING-001"'),
  severity: SeverityEnum,
  category: CategoryEnum,
  file: z.string().describe('File path where the issue was found'),
  line: z.number().nullable().describe('Line number if applicable, null otherwise'),
  description: z.string().describe('Clear description of the issue'),
  recommendation: z.string().describe('Specific fix recommendation'),
});

// ─── Critic Report Schema ───────────────────────────────────────

export const CriticReportSchema = z.object({
  overallScore: z.number().min(1).max(10).describe('Overall quality score from 1-10'),
  passed: z.boolean().describe('Whether the project passes quality review (score >= 8 and no critical/major issues)'),
  issues: z.array(IssueSchema).describe('List of all identified issues'),
  summary: z.string().describe('Brief summary of the review findings'),
  strengths: z.array(z.string()).describe('What the project does well'),
});

export type Issue = z.infer<typeof IssueSchema>;
export type CriticReport = z.infer<typeof CriticReportSchema>;
