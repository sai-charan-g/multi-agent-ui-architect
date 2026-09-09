# Component Catalog & Structural Patterns

Components must follow clean structural rules to maintain a professional layout, high usability, and award-winning visual aesthetics derived from modern libraries (**Aceternity UI**, **Magic UI**, and **shadcn/ui**).

---

## 1. Global Navigation (Navbar)

- **Sticky Glassmorphism Header**:
  - Always position fixed/sticky at the top of the viewport (`sticky top-0 z-50`).
  - Height must be `h-16` (`64px`) or `h-20` for luxury editorial sites.
  - Use glassmorphism border-bottom: `border-b border-white/[0.08] bg-background/80 backdrop-blur-md`.
- **Layout Division**:
  - Left: Logo + Brand Name (bold typography, tracking-tight, optional brand badge/icon).
  - Center: Main navigation links (about, features, menu, pricing) with subtle hover effects (`text-muted-foreground hover:text-foreground transition-colors`).
  - Right: Secondary action button ("Sign In" / "Contact") + Primary action button ("Get Started" / "Book a Table").
- **Mobile Menu**: Include a responsive mobile drawer menu triggered by a hamburger button. Ensure touch target is at least `44x44px`.

---

## 2. Hero Section Variations

The hero is the first visual impression. It must hook the user immediately with crisp typography and atmospheric depth.

### 2.1 Atmospheric Radial Background & Tag Badge (Modern SaaS & AI)
- **Background Atmosphere**:
  ```jsx
  <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
  ```
- **Tagline Badge with Live Pulse**:
  ```jsx
  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
    </span>
    Version 2.0 is now live →
  </div>
  ```
- **H1 Display Title**: Bold, tracking-tight (`text-4xl sm:text-6xl font-extrabold tracking-tight`), maximum width container (`max-w-4xl`) to prevent awkward single-word wrapping.
- **Subtitle**: `text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed`.
- **Double CTA Row**: Primary action alongside a ghost or secondary button with subtle scale-on-hover.

### 2.2 Split Atmospheric Layout (Hospitality, Restaurant, DTC)
- 2-column grid (`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh]`).
- Left: Editorial headline with serif or warm typography, narrative subtitle, CTA buttons, and social proof trust counters.
- Right: Large atmospheric photography container with rounded-3xl corners, border overlay, and floating highlight card (e.g. "Signature Dish", "Chef's Tasting Menu").

---

## 3. Bento Grid Features (Aceternity / Magic UI Standard)

Replace plain 3-column repetitive feature boxes with an **Asymmetric Bento Grid**:
- Uses an asymmetric 3-column or 5-column grid on desktop:
  ```jsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
  ```
- Mixes 2-column span cards (`md:col-span-2`) with 1-column span cards (`md:col-span-1`).
- **Aceternity-Style Bento Card Styling**:
  ```jsx
  <div className="group/bento relative row-span-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.1] bg-card/60 p-8 backdrop-blur-sm shadow-input dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
    <div>
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover/bento:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
    {/* Micro visual or simulated UI widget */}
  </div>
  ```

---

## 4. Shimmer / Glowing Border Button (Magic UI Recipe)

For high-converting hero CTAs:
```jsx
<button className="relative inline-flex h-11 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c084fc_0%,#6366f1_50%,#c084fc_100%)] opacity-70" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-background px-6 py-1 text-sm font-semibold text-foreground backdrop-blur-3xl transition-colors hover:bg-background/80 gap-2">
    <span>Get Started Free</span>
    <ArrowRight className="h-4 w-4" />
  </span>
</button>
```

---

## 5. Interactive Pricing Tier Switcher

Pricing cards must support interactive Monthly vs Annual billing toggles:
```jsx
const [isAnnual, setIsAnnual] = useState(true);

<div className="flex items-center justify-center gap-3 mb-12">
  <span className={cn("text-sm font-medium", !isAnnual ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
  <button
    type="button"
    onClick={() => setIsAnnual(!isAnnual)}
    className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/20 transition-colors"
  >
    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-primary transition-transform", isAnnual ? "translate-x-6" : "translate-x-1")} />
  </button>
  <span className={cn("text-sm font-medium", isAnnual ? "text-foreground" : "text-muted-foreground")}>
    Annual <span className="ml-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">Save 20%</span>
  </span>
</div>
```
- **Tier Cards**:
  - 3-column pricing tier grid.
  - Highlight the "Most Popular" card with `scale-105`, radiant border (`border-primary`), glowing background tint, and a "Most Popular" badge.
  - Feature lists with Lucide `Check` icons in emerald or primary brand color.

---

## 6. Metrics & Impact Counters

Elevate credibility with a dedicated metrics row:
```jsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-border/40">
  {metrics.map((m) => (
    <div key={m.label} className="text-center">
      <div className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {m.value}
      </div>
      <div className="mt-2 text-sm text-muted-foreground font-medium">{m.label}</div>
    </div>
  ))}
</div>
```

---

## 7. Interactive FAQ Accordion

Provide an interactive disclosure FAQ:
```jsx
const [openIdx, setOpenIdx] = useState<number | null>(0);

<div className="max-w-3xl mx-auto space-y-4">
  {faqs.map((faq, i) => (
    <div key={i} className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden transition-colors">
      <button
        onClick={() => setOpenIdx(openIdx === i ? null : i)}
        className="flex w-full items-center justify-between p-6 text-left font-semibold transition-colors hover:text-primary"
      >
        <span>{faq.q}</span>
        <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", openIdx === i && "rotate-180")} />
      </button>
      {openIdx === i && (
        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200">
          {faq.a}
        </div>
      )}
    </div>
  ))}
</div>
```

---

## 8. Glassmorphic Glow Card Recipe

For featured cards and callouts, use this high-end recipe:
```jsx
<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-primary/40">
  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
  {/* Card content */}
</div>
```
