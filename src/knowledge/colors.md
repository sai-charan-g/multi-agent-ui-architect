# Color System & Palette Construction

Color system rules enforce accessibility (WCAG AA), tone consistency, and clean layouts. Random, vibrant colors can make a site look amateurish.

---

## 1. Palette Construction & Color Limits

A premium site uses a monochrome base (neutrals) paired with a single primary accent color.

### 1.1 Palette Division
- **60% Dominate (Neutrals)**: Backgrounds, cards, borders, body text.
- **30% Secondary (Subtle Neutrals / Secondary)**: Alternating sections, card headers, disabled states.
- **10% Accent (Brand Color)**: Primary CTAs, active states, key icons, glows, focus rings.

---

## 2. HSL Tokens & Semantic Roles

We define colors in HSL format without the function wrap. This allows Tailwind to apply transparency easily using syntax like `bg-primary/10`.

### 2.1 Standard Dark System Tokens (Reference)
- `background`: `240 10% 3.9%` (Deep pitch black-zinc)
- `foreground`: `0 0% 98%` (Almost pure white for high contrast text)
- `card`: `240 10% 5.9%` (Subtle grey-zinc card background)
- `card-foreground`: `0 0% 98%` (High contrast text on cards)
- `popover`: `240 10% 3.9%` (Matches background or slightly lighter)
- `popover-foreground`: `0 0% 98%`
- `primary`: `0 0% 98%` (White primary action button background)
- `primary-foreground`: `240 5.9% 10%` (Dark text on white buttons)
- `secondary`: `240 3.7% 15.9%` (Muted dark gray for secondary actions)
- `secondary-foreground`: `0 0% 98%`
- `muted`: `240 3.7% 15.9%` (Muted blocks background)
- `muted-foreground`: `240 5% 64.9%` (Zinc-gray secondary text color)
- `accent`: `240 3.7% 15.9%`
- `accent-foreground`: `0 0% 98%`
- `destructive`: `0 62.8% 30.6%` (Dark crimson red)
- `destructive-foreground`: `0 0% 98%`
- `border`: `240 3.7% 15.9%` (Subtle thin border lines)
- `input`: `240 3.7% 15.9%`
- `ring`: `240 4.9% 83.9%` (Strong contrast outline highlight)

---

## 3. WCAG AA Contrast Compliance

Ensure text colors maintain a contrast ratio of at least `4.5:1` against the background (or `3:1` for large text above `24px`).

- **White on Dark**: Background HSL `240 10% 3.9%` (L=3.9%) and Foreground HSL `0 0% 98%` (L=98%) offers a contrast of over `18:1`.
- **Muted text on Dark**: Muted text must maintain at least `L=60%` on a background of `L=5%`.
- **Vibrant Brand Accents**: When using bright brand accents (e.g., brand-blue `221.2 83.2% 53.3%`), ensure the text color layered inside is fully contrast-safe (e.g., pure white on primary blue).

---

## 4. Glowing Accents & Shadows
- Avoid heavy colorful gradients across entire pages.
- Use low-opacity primary brand colors for radial glow backdrops: `bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.15),transparent_50%)]`.
- Focus rings must use `ring-2 ring-ring ring-offset-2 ring-offset-background` to guarantee clear focus state visibility.
