# Tailwind CSS v4 Conventions & Guidelines

Tailwind CSS v4 uses a CSS-first configuration pipeline. There is no `tailwind.config.js` file. All themes and properties are declared using CSS variables inside the global stylesheet.

---

## 1. Setup & Directives

The entry style file must be `src/app/globals.css`.

- **Imports**:
  - Always import Tailwind at the top of the file: `@import "tailwindcss";`.
- **Theme Configuration**:
  - Customize themes using the `@theme` directive:
    ```css
    @import "tailwindcss";

    @theme {
      --font-heading: "Plus Jakarta Sans", sans-serif;
      --font-body: "Inter", sans-serif;
      
      --color-primary: hsl(var(--primary));
      --color-background: hsl(var(--background));
      --color-foreground: hsl(var(--foreground));
      --color-border: hsl(var(--border));
      
      --radius-lg: var(--radius);
      --radius-md: calc(var(--radius) - 2px);
      --radius-sm: calc(var(--radius) - 4px);
    }

    @layer base {
      body {
        @apply bg-background text-foreground antialiased;
      }
    }
    ```

---

## 2. Utility Class Ordering

To keep code clean and readable, utility classes must follow a strict layout-to-color sequence inside components.

1. **Layout & Display**: `relative`, `absolute`, `flex`, `grid`, `block`, `hidden`, `z-50`.
2. **Flex/Grid Config**: `items-center`, `justify-between`, `grid-cols-3`, `gap-6`.
3. **Spacing & Margin**: `m-4`, `mx-auto`, `p-6`, `py-8`, `space-y-4`.
4. **Sizing (Dimensions)**: `w-full`, `h-16`, `max-w-xl`, `size-8`.
5. **Typography**: `text-lg`, `font-bold`, `tracking-tight`, `leading-none`, `text-center`.
6. **Colors & Borders**: `bg-background`, `text-primary`, `border`, `border-border/40`.
7. **Effects & Visuals**: `shadow-md`, `rounded-xl`, `opacity-90`, `backdrop-blur-md`.
8. **Transitions & States**: `transition-all`, `duration-200`, `hover:-translate-y-1`, `focus-visible:ring-2`.

---

## 3. Best Practices & Rules

- **No Duplicate Classes**: Ensure elements do not declare duplicate padding or margin properties (e.g. avoid `p-4 px-6` — write `py-4 px-6` instead).
- **Avoid Arbitrary Values**: Do not write arbitrary pixel properties like `w-[372px]` or `mt-[19px]`. Use Tailwind's spacing scale values (`w-96`, `mt-5`) to keep layout rhythm consistent.
- **Opacity Tints**: Use HSL color variables with opacity divider syntax for secondary borders or backgrounds: `border-border/40` or `bg-primary/5`.
- **CSS Custom Properties Mapping**: Apply the design token settings using variables defined in your globals file, ensuring the generated React components use semantic color classes (e.g., `bg-background`, `border-border`) rather than hardcoded colors.
