# Frontend Guidelines & Code Standards

Enforce strict coding standards to ensure Next.js and React applications are clean, maintainable, performant, type-safe, and highly engaging.

---

## 1. High-End UI & Interactivity (MANDATORY)

- **Framer Motion**: You MUST use `framer-motion` for all UI interactions to make the app feel alive and premium.
  - Apply staggered fade-ins for lists and grids using `initial`, `animate`, and `transition={{ staggerChildren: 0.1 }}`.
  - Apply `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}` to interactive elements (Cards, Buttons).
  - Use scroll-triggered animations via `whileInView={{ opacity: 1, y: 0 }}` and `viewport={{ once: true }}`.
- **Dynamic Hover States**: Every single button, card, and link must have an obvious visual change on hover (colors, shadows, or scale). Do not leave static buttons.

---

## 2. Realistic Images (MANDATORY)

- **NEVER use empty divs or solid color blocks for images.**
- Use realistic placeholder image services to populate the design with high-quality visual content.
- Use **Picsum** or **LoremFlickr** and infer the correct keyword based on the section (e.g., fitness, dashboard, office, abstract).
  - Example: `https://picsum.photos/seed/dashboard/800/600`
  - Example: `https://loremflickr.com/800/600/fitness`
- Always apply `object-cover` and realistic rounded borders to image containers.

---

## 3. Next.js App Router & Component Rules

- **Server-First Architecture**: By default, all components are Server Components. This keeps client-side JS bundles small and improves speed.
- **Client Boundary (`"use client"`)**: Declare `"use client"` only in files that:
  - Use React hooks (`useState`, `useEffect`, `useContext`, `useRef`).
  - Listen for interactive DOM events (clicks, keypresses, forms).
  - Import client-only libraries (e.g. Framer Motion elements).
- **Directory Structure**:
  - `src/app/`: Routing routes, page layout definitions.
  - `src/components/layout/`: Global elements (Navbar, Footer, Sidebars).
  - `src/components/sections/`: Page sections (Hero, Features, Pricing).
  - `src/components/ui/`: Atomic, reusable base UI elements (Button, Card, Input).
  - `src/lib/`: Reusable utilities and API helpers.

---

## 4. Import Organization

Imports must be ordered cleanly inside files. Group and separate them with a blank line:

1. **React core hooks/methods**: `import * as React from "react";`
2. **Next.js modules**: `import Link from "next/link"; import { useRouter } from "next/navigation";`
3. **Third-party icons/libs**: `import { ArrowRight } from "lucide-react"; import { motion } from "framer-motion";`
4. **Local components/layout**: `import { Button } from "@/components/ui/button";`
5. **Local helper utilities/styles**: `import { cn } from "@/lib/utils";`

---

## 5. Strict TypeScript & Type Safety

- **No `any`**: Always type every parameter, response, and component prop. Use appropriate types:
  ```typescript
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }
  ```
- **React.FC / Function return type**: Declare component function returns explicitly using typescript types.
  ```typescript
  export function Hero({ title, subtitle }: HeroProps): React.JSX.Element {
    return <section>...</section>;
  }
  ```

---

## 6. Reusable CN Class Merger

Conditional styles must use the class merger utility (`cn()`) combining `clsx` and `tailwind-merge` to resolve styling overrides cleanly.

Create `src/lib/utils.ts` in every project:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 7. SEO & Core Web Vitals

- **Layout Metadata**: Always include page metadata objects at the top of pages or root layouts for good SEO indexing.
  ```typescript
  export const metadata = {
    title: "InboxZero — Modern Email Client",
    description: "Declutter your inbox with automatic AI filtering.",
  };
  ```
- **Google Fonts (Next.js config)**: Use `next/font/google` to import fonts. This automatically downloads font assets at build time, preventing layout shift (CLS).
- **Interactive Images**: Use `next/image` rather than raw HTML `<img>` tags to ensure proper aspect ratio rendering, compression scaling, and automatic lazy-loading.
