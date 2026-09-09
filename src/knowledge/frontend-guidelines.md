# Frontend Guidelines & Code Standards

Enforce strict coding standards to ensure Next.js and React applications are clean, maintainable, performant, type-safe, and visually stunning.

---

## 1. Visual Polish & Hierarchy (Refactoring UI Principles)

- **Establish Hierarchy Without Relying Only on Font Size**:
  - Combine font weight (`font-bold`, `font-medium`), opacity/contrast (`text-foreground` vs `text-muted-foreground`), and letter-spacing (`tracking-tight`).
  - Secondary text must NEVER be pitch black or bright white — use muted slate/zinc tones.
- **Fewer Heavy Borders, More Background Tint & Whitespace**:
  - Do NOT separate every card or section with thick, harsh borders.
  - Use subtle background shifts (`bg-muted/40` or `bg-card/60`) and delicate border lines (`border border-border/40` or `border-white/[0.08]`).
  - **Generous Spacing**: Give sections room to breathe. Use `py-20 md:py-32` for top-level page sections and `gap-8 md:gap-12` between grids.
- **Micro-Animations & Interactivity**:
  - Use Framer Motion or Tailwind transitions on every card, button, and link:
    `transition-all duration-200 hover:-translate-y-1 hover:border-primary/30`.

---

## 2. High-Aesthetic Photography & Media Standards (MANDATORY)

- **NEVER use empty gray rectangles or generic low-resolution placeholders.**
- **Curated Thematic Photography**: Use Unsplash image URLs with rich semantic keywords matching the project's domain:
  - **Hospitality & Dining**: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80` (Restaurant interior), `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80` (Gourmet food).
  - **Modern Tech / SaaS**: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80` (Analytics dashboard), `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80` (Modern developer desk).
  - **Architecture & Interiors**: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80`.
  - **Creative / Agency / People**: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80` (Portrait avatar).
- **Hero Image Readability (Crucial)**:
  - When placing text over a full-width background photo, you MUST apply an atmospheric dark gradient overlay so text remains 100% legible:
    ```jsx
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30 z-10" />
    ```
- **Aspect Ratio Locking**:
  - Always enforce consistent aspect ratios on cards using `aspect-[16/9]`, `aspect-[4/3]`, or `aspect-square` with `object-cover` to avoid cumulative layout shift (CLS).

---

## 3. Strict Anti-Patterns ("What NOT to do")

- ❌ **No Plain Gray Boxes**: Never use flat `bg-gray-200` or `bg-zinc-800` cards without a border, rounded corners, or hover state.
- ❌ **No Low-Contrast Text**: Never put `text-zinc-600` on a dark `bg-zinc-950` background. Always verify text passes WCAG AA contrast (use `text-zinc-300` or `text-zinc-400` for muted text).
- ❌ **No Unstyled Form Controls**: Never render browser-default inputs, buttons, or checkboxes. All interactive controls must have styled borders, focus rings, and placeholder styling.
- ❌ **No Missing Fallbacks**: Ensure all external images include valid `alt` tags and fallback container backgrounds (`bg-muted`).

---

## 4. Next.js App Router & Component Rules

- **Server-First Architecture**: By default, components are Server Components.
- **Client Boundary (`"use client"`)**: Declare `"use client"` only in files that:
  - Use React hooks (`useState`, `useEffect`, `useRef`).
  - Contain interactive components (pricing toggle, mobile menu, accordion, tabs).
  - Use Framer Motion animations.
- **Directory Structure**:
  - `src/app/`: Page routes and root layout.
  - `src/components/layout/`: Global elements (Navbar, Footer).
  - `src/components/sections/`: Page sections (Hero, BentoFeatures, Pricing, Menu, FAQ).
  - `src/components/ui/`: Reusable primitives (Button, Card, Badge, Input).
  - `src/lib/`: Utilities (`utils.ts`).

---

## 5. Reusable `cn()` Class Merger

All conditional class merging must use the `cn()` utility:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 6. Strict TypeScript & Clean Imports

- **No `any`**: Type all props, responses, and states explicitly.
- **Import Order**:
  1. React core: `import * as React from "react";`
  2. Next.js modules: `import Link from "next/link";`
  3. Icons & animations: `import { Check, ArrowRight } from "lucide-react"; import { motion } from "framer-motion";`
  4. Local components: `import { Button } from "@/components/ui/button";`
  5. Utilities: `import { cn } from "@/lib/utils";`
