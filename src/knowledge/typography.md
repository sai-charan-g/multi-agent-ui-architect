# Typography & Font Pairings

Typography is the voice of the interface. Good typography establishes tone, structure, and readability, while poor typography makes a design look cheap.

---

## 1. Font Selection & Pairings

For premium results, limit projects to two font families at most: one for headings, one for body/interface text.

### 1.1 Recommended Headings + Body Pairings
- **The Modern Tech Pairing**: `Outfit` / `Inter` or `Sora` / `Inter` (Excellent for AI, DevTools, SaaS).
- **The High-End Minimal Pairing**: `Plus Jakarta Sans` / `Inter` or `Geist` / `Geist Mono` (Excellent for dark modern layouts).
- **The Elegant Editorial Pairing**: `Playfair Display` / `Source Sans Pro` or `Fraunces` / `Inter` (Excellent for agencies, editorial blogs, luxury SaaS).
- **Monospace Pairing**: `Geist Mono` or `Fira Code` (Use only for code examples, badge texts, secondary small metrics).

---

## 2. Typographic Scale

To avoid messy layouts, use a mathematical modular scale.

| Category | Tailwind Class | size | weight | tracking | line-height | Usage |
|:---|:---|:---|:---|:---|:---|:---|
| **Display H1** | `text-5xl md:text-7xl` | 3rem to 4.5rem | `font-bold` | `tracking-tight` | `leading-[1.1]` | Hero section primary heading |
| **Section H2** | `text-3xl md:text-5xl` | 2rem to 3rem | `font-semibold` | `tracking-tight` | `leading-tight` | Primary section headings |
| **Subsection H3** | `text-xl md:text-2xl` | 1.25rem to 1.5rem | `font-semibold` | `tracking-normal` | `leading-snug` | Feature cards headings, FAQ questions |
| **Body Large** | `text-lg md:text-xl` | 1.125rem to 1.25rem | `font-normal` | `tracking-normal` | `leading-relaxed` | Hero subtext, feature intro text |
| **Body Base** | `text-base` | 1rem | `font-normal` | `tracking-normal` | `leading-relaxed` | Default text, paragraph text, cards |
| **Interface Small** | `text-sm` | 0.875rem | `font-medium` | `tracking-normal` | `leading-normal` | Buttons, navigation links, input labels |
| **Badge / Caption** | `text-xs` | 0.75rem | `font-semibold` | `tracking-wider` | `leading-none` | Top-of-section badges, tags, metadata |

---

## 3. Leading & Tracking Guidelines

- **Tracking (Letter Spacing)**:
  - Large display headings (`text-4xl` and above) need negative letter spacing to feel tight and cohesive: `tracking-tight` (`-0.025em`) or `tracking-tighter` (`-0.05em`).
  - Small elements like uppercase badges or caption text need extra letter spacing to remain readable: `tracking-wider` (`0.05em`) or `tracking-widest` (`0.1em`).
- **Leading (Line Height)**:
  - Big headings need tight leading: `leading-tight` (`1.2` or `1.1`).
  - Body paragraphs need breathing room: `leading-relaxed` (`1.625` or `1.75`).
  - Interface elements (buttons, inputs) need neutral leading: `leading-none` (`1`) or `leading-normal` (`1.5`).

---

## 4. Line Length & Readability

- Body text must never stretch across the full width of the screen. Keep the line length between `45` to `75` characters per line (approx. `65ch`).
- Use the `max-w-prose` or `max-w-2xl` classes to restrict paragraph widths on large screens.
