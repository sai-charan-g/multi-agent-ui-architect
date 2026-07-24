# Component Catalog & Structural Patterns

Components must follow clean structural rules to maintain a professional layout and high usability.

---

## 1. Global Navigation (Navbar)

- **Sticky Glassmorphism Header**:
  - Always position fixed/sticky at the top of the viewport (`sticky top-0 z-50`).
  - Height must be exactly `h-16` (`64px`).
  - Use glassmorphism border-bottom: `border-b border-border/40 bg-background/80 backdrop-blur-md`.
- **Layout Division**:
  - Left: Logo + Brand Name (bold typography, tracking-tight).
  - Center: Main navigation links (about, pricing, features).
  - Right: Secondary action button ("Sign In") + Primary action button ("Get Started").
- **Mobile Menu**: Include a responsive mobile drawer menu triggered by a hamburger button. Ensure touch target is at least `44x44px`.

---

## 2. Hero Section

The hero is the first visual impression. It must hook the user.

- **Centered Impact Layout**:
  - Centered tagline badge at the top: small text, rounded pill, low opacity background, primary border.
  - H1 Display title: bold, tracking-tight, maximum width container to prevent single-word wrap lines.
  - Subtitle: muted gray text, `max-w-2xl` for readability, center aligned.
  - Buttons row: Primary CTA next to Secondary CTA with a small gap (`gap-4`).
- **Interactive Visual**:
  - Below the content group, include a high-fidelity visual mockup of the product dashboard.
  - Apply clean outer shadows (`shadow-2xl`) and subtle border radii (`rounded-xl` or `rounded-2xl`) to simulate desktop screens.
  - Wrap the mockup container in a subtle Framer Motion entrance animation.

---

## 3. Features Section

- **The Feature Grid**:
  - 3-column grid on desktop, stacking into a single column on mobile.
  - Each card must feature: a rounded icon container (brand color tint), an H3 heading, and a muted description paragraph.
- **Alternating Showcase**:
  - For advanced features, use a 2-column alternating split screen: text + checkmarks list on one side, and an interactive component or code example on the other side.
  - Alternate the order for consecutive blocks (e.g., Row 1: Left Text/Right Visual, Row 2: Left Visual/Right Text).

---

## 4. Testimonials & Social Proof

- **Logo Cloud**: Include a monochrome, low-opacity list of brand logos immediately below the hero section to establish instant trust.
- **Masonry Grid**:
  - Organize testimonials in a 3-column card grid.
  - Cards should look clean: flat background, subtle border, profile image (circle), name, role, and the quote inside.

---

## 5. Pricing Section

- **Tier Cards**:
  - 2-3 pricing tier columns.
  - Highlight the "Most Popular" or "Recommended" card by using a slightly larger scale, a border highlight (brand accent), and placing a badge at the top.
  - Each card must have: Tier name, price (large display size), billing period ("per month"), list of features with checkmark icons, and a tier-specific CTA button.

---

## 6. Buttons & Inputs

- **Button Sizing**:
  - Large: `h-11 px-8 text-sm`
  - Medium (Default): `h-10 px-6 text-sm`
  - Small: `h-9 px-4 text-xs`
- **Input Fields**:
  - Heights must match default buttons (`h-10 px-3 py-2`).
  - Rounding must match the system border-radius token (`rounded-md` or `rounded-lg`).
  - Active focus states: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Card Patterns**:
  - Default layout padding: `p-6` or `p-8`.
  - Border: `1px solid border`.
  - Shadow: `shadow-sm` or `shadow-md`.
  - Hover: subtle translate-y action + outline border glow.
  ```typescript
  className="transition-all duration-200 hover:-translate-y-1 hover:border-primary/20"
  ```
