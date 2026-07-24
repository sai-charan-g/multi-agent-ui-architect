import { z } from 'zod';

// ─── Color Tokens ───────────────────────────────────────────────

export const ColorTokensSchema = z.object({
  primary: z.string().describe('Primary brand color in HSL, e.g. "222.2 47.4% 11.2%"'),
  primaryForeground: z.string().describe('Text color on primary background'),
  secondary: z.string().describe('Secondary color in HSL'),
  secondaryForeground: z.string().describe('Text color on secondary background'),
  accent: z.string().describe('Accent color for highlights'),
  accentForeground: z.string().describe('Text on accent'),
  background: z.string().describe('Page background color'),
  foreground: z.string().describe('Default text color'),
  muted: z.string().describe('Muted background for subtle areas'),
  mutedForeground: z.string().describe('Text on muted backgrounds'),
  card: z.string().describe('Card background color'),
  cardForeground: z.string().describe('Text on cards'),
  border: z.string().describe('Default border color'),
  input: z.string().describe('Input border color'),
  ring: z.string().describe('Focus ring color'),
  destructive: z.string().describe('Error/destructive color'),
  destructiveForeground: z.string().describe('Text on destructive'),
});

// ─── Typography Tokens ──────────────────────────────────────────

export const FontFamilySchema = z.object({
  heading: z.string().describe('Font family for headings, e.g. "Inter"'),
  body: z.string().describe('Font family for body text'),
  mono: z.string().describe('Monospace font family'),
});

export const TypeScaleSchema = z.object({
  xs: z.string().describe('Extra small text size, e.g. "0.75rem"'),
  sm: z.string().describe('Small text size'),
  base: z.string().describe('Base text size'),
  lg: z.string().describe('Large text size'),
  xl: z.string().describe('Extra large text size'),
  '2xl': z.string().describe('2x large'),
  '3xl': z.string().describe('3x large'),
  '4xl': z.string().describe('4x large'),
  '5xl': z.string().describe('5x large'),
  '6xl': z.string().describe('6x large'),
});

export const TypographyTokensSchema = z.object({
  fontFamily: FontFamilySchema,
  scale: TypeScaleSchema,
  lineHeight: z.object({
    tight: z.string().describe('Tight line height, e.g. "1.1"'),
    normal: z.string().describe('Normal line height, e.g. "1.5"'),
    relaxed: z.string().describe('Relaxed line height, e.g. "1.75"'),
  }),
  fontWeight: z.object({
    normal: z.number().describe('Normal weight, e.g. 400'),
    medium: z.number().describe('Medium weight, e.g. 500'),
    semibold: z.number().describe('Semibold weight, e.g. 600'),
    bold: z.number().describe('Bold weight, e.g. 700'),
  }),
});

// ─── Spacing Tokens ─────────────────────────────────────────────

export const SpacingTokensSchema = z.object({
  unit: z.number().describe('Base spacing unit in px, should be 8'),
  scale: z.record(z.string(), z.string()).describe('Spacing scale map, e.g. { "1": "4px", "2": "8px", ... }'),
  sectionGap: z.string().describe('Vertical gap between page sections, e.g. "96px" or "120px"'),
  containerMaxWidth: z.string().describe('Max width of content container, e.g. "1200px"'),
  containerPadding: z.string().describe('Horizontal padding on container, e.g. "24px"'),
});

// ─── Border Tokens ──────────────────────────────────────────────

export const BorderTokensSchema = z.object({
  radius: z.object({
    sm: z.string().describe('Small radius, e.g. "4px"'),
    md: z.string().describe('Medium radius, e.g. "8px"'),
    lg: z.string().describe('Large radius, e.g. "12px"'),
    xl: z.string().describe('Extra large radius, e.g. "16px"'),
    full: z.string().describe('Full/pill radius, e.g. "9999px"'),
  }),
  width: z.object({
    default: z.string().describe('Default border width, e.g. "1px"'),
    thick: z.string().describe('Thick border width, e.g. "2px"'),
  }),
});

// ─── Shadow Tokens ──────────────────────────────────────────────

export const ShadowTokensSchema = z.object({
  sm: z.string().describe('Small shadow'),
  md: z.string().describe('Medium shadow'),
  lg: z.string().describe('Large shadow'),
  xl: z.string().describe('Extra large shadow'),
});

// ─── Motion Tokens ──────────────────────────────────────────────

export const MotionTokensSchema = z.object({
  duration: z.object({
    fast: z.string().describe('Fast duration, e.g. "150ms"'),
    normal: z.string().describe('Normal duration, e.g. "200ms"'),
    slow: z.string().describe('Slow duration, e.g. "300ms"'),
  }),
  easing: z.object({
    default: z.string().describe('Default easing, e.g. "cubic-bezier(0.4, 0, 0.2, 1)"'),
    spring: z.string().describe('Spring-like easing'),
  }),
});

// ─── Grid & Breakpoints ─────────────────────────────────────────

export const GridTokensSchema = z.object({
  columns: z.number().describe('Number of grid columns, should be 12'),
  gap: z.string().describe('Default grid gap, e.g. "24px"'),
});

export const BreakpointTokensSchema = z.object({
  sm: z.string().describe('Small breakpoint, e.g. "640px"'),
  md: z.string().describe('Medium breakpoint, e.g. "768px"'),
  lg: z.string().describe('Large breakpoint, e.g. "1024px"'),
  xl: z.string().describe('Extra large breakpoint, e.g. "1280px"'),
  '2xl': z.string().describe('2x large breakpoint, e.g. "1536px"'),
});

// ─── Combined Design Tokens ─────────────────────────────────────

export const DesignTokensSchema = z.object({
  colors: ColorTokensSchema,
  typography: TypographyTokensSchema,
  spacing: SpacingTokensSchema,
  borders: BorderTokensSchema,
  shadows: ShadowTokensSchema,
  motion: MotionTokensSchema,
  grid: GridTokensSchema,
  breakpoints: BreakpointTokensSchema,
});

export type DesignTokens = z.infer<typeof DesignTokensSchema>;
