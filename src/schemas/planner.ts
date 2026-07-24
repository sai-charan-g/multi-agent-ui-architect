import { z } from 'zod';

// ─── Input Schema ───────────────────────────────────────────────

export const PlannerInputSchema = z.object({
  userRequest: z.string().describe('Raw user description of what website they want'),
  constraints: z.array(z.string()).optional().describe('Optional constraints or preferences'),
});

export type PlannerInput = z.infer<typeof PlannerInputSchema>;

// ─── Output Schema ──────────────────────────────────────────────

export const WebsiteTypeEnum = z.enum([
  'saas_landing',
  'portfolio',
  'docs',
  'blog',
  'ecommerce',
  'dashboard',
  'agency',
  'startup',
  'developer_tools',
]);

export const StyleEnum = z.enum([
  'minimal',
  'bold',
  'corporate',
  'playful',
  'editorial',
  'dark_modern',
  'glassmorphism',
]);

export const ToneEnum = z.enum([
  'professional',
  'casual',
  'technical',
  'friendly',
  'luxury',
  'energetic',
]);

export const SectionTypeEnum = z.enum([
  'navbar',
  'hero',
  'features',
  'feature_grid',
  'feature_showcase',
  'how_it_works',
  'pricing',
  'testimonials',
  'faq',
  'cta',
  'stats',
  'logos',
  'comparison',
  'team',
  'blog_preview',
  'newsletter',
  'footer',
]);

export const PageSchema = z.object({
  slug: z.string().describe('URL path, e.g. "/" or "/pricing"'),
  title: z.string().describe('Page title for SEO'),
  purpose: z.string().describe('Brief description of page purpose'),
});

export const SectionSchema = z.object({
  page: z.string().describe('Which page this section belongs to (slug)'),
  order: z.number().describe('Order of section on the page (1-based)'),
  type: SectionTypeEnum,
  brief: z.string().describe('1-2 sentence description of what this section should contain'),
});

export const CTASchema = z.object({
  primary: z.string().describe('Primary CTA text, e.g. "Get Started Free"'),
  secondary: z.string().describe('Secondary CTA text, e.g. "View Demo"'),
});

export const PlannerOutputSchema = z.object({
  websiteType: WebsiteTypeEnum,
  style: StyleEnum,
  tone: ToneEnum,
  targetAudience: z.string().describe('Who this website is for'),
  businessGoals: z.array(z.string()).describe('Key business objectives'),
  pages: z.array(PageSchema).describe('All pages to generate'),
  sections: z.array(SectionSchema).describe('All sections across all pages, ordered'),
  cta: CTASchema,
  designDirection: z.string().describe('2-3 sentence visual direction guidance'),
  brandName: z.string().describe('Name of the brand/product'),
  tagline: z.string().describe('Short tagline or value proposition'),
});

export type PlannerOutput = z.infer<typeof PlannerOutputSchema>;
