# Industry-Specific Layout Blueprints

When designing a website, adapt the section flow, typography, visual tone, and component selection to match the target industry. Use these battle-tested blueprints.

---

## 1. Restaurant, Hospitality & Culinary (e.g. Fine Dining, Bistro, Cafe)

- **Visual Vibe**: Warm luxury, moody dark backgrounds or earthy tones (warm stone, deep amber, charcoal), elegant serif or refined sans-serif headings, appetizing photography with subtle warm glows.
- **Section Flow & Archetypes**:
  1. **Hero**: Atmospheric full-width background photo with gradient dark overlay (`bg-gradient-to-t from-background via-background/60 to-transparent`). Centered display typography, tagline badge ("Est. 2024 · Michelin Selected"), Primary CTA ("Reserve a Table") + Secondary CTA ("Explore Menu").
  2. **Story / Chef's Philosophy**: 2-column split. Left: High-resolution culinary photo with rounded-2xl border. Right: Editorial narrative with quote highlight and Chef signature.
  3. **Interactive Menu Showcase**: Filterable category tabs (e.g., Starters, Mains, Desserts, Cocktails). Each dish card includes: Item name, price tag, ingredients/description, and dietary badges (e.g. *Vegan*, *GF*, *Chef's Special*).
  4. **Atmosphere / Gallery**: 3 or 4-image asymmetric grid showing interior, cocktail bar, and dining ambience.
  5. **Reservation & Hours Card**: Glassmorphic card featuring reservation time selector or contact link, opening hours table, address, and interactive map placeholder or driving directions link.
  6. **Footer**: Brand mark, social links, newsletter signup for seasonal menus, legal.

---

## 2. B2B SaaS & Tech Product

- **Visual Vibe**: Crisp modern dark mode or ultra-clean light mode, cool neutrals (zinc/slate), vibrant primary accent (indigo, violet, or emerald), glowing gradient borders, micro-interactions.
- **Section Flow & Archetypes**:
  1. **Hero**: Centered announcement badge with pulse dot ("v2.0 is now live →"). Punchy H1 heading with gradient text highlights. Subtitle (`max-w-2xl text-muted-foreground`). Double CTA ("Start Free Trial" + "Book a Demo").
  2. **Product Mockup / Interactive Frame**: Floating browser/dashboard preview with glassmorphic border (`border border-white/10 shadow-2xl`), subtle tilt or Framer Motion floating hover.
  3. **Social Proof Logo Cloud**: Monochrome, low-opacity row of Fortune 500 / tech logos ("Trusted by 10,000+ engineering teams").
  4. **Bento Grid Features**: Asymmetric 3-column grid combining 2-span cards with micro-charts, real-time analytics simulation, and 1-span cards with icon highlights.
  5. **Metrics & Impact Row**: 3 or 4-column counter cards with large numbers (`99.99% Uptime`, `10x Faster`, `500k+ Users`) and micro-captions.
  6. **Interactive Pricing Switcher**: Monthly / Annual toggle button (with "Save 20%" badge). 3 tier cards (Starter, Pro [Highlighted/Popular], Enterprise).
  7. **Interactive Accordion FAQ**: 5-6 common questions with animated collapsible answers.
  8. **High-Impact Bottom CTA Banner**: Gradient glow background box with rapid onboarding CTA.

---

## 3. E-Commerce & Direct-to-Consumer (DTC)

- **Visual Vibe**: High contrast, crisp product imagery, minimal visual clutter, prominent prices, badges, and trust indicators.
- **Section Flow & Archetypes**:
  1. **Hero**: Split 50/50 hero. Left: Value proposition headline, bullet list of guarantees (Free shipping, 30-day money back), "Shop Collection" CTA. Right: Hero product cut-out image with floating customer review badge.
  2. **Value Props Strip**: 4-column horizontal icon strip (Free Express Shipping, 100% Organic/Authentic, 24/7 Support, Secure Checkout).
  3. **Featured Products Grid**: 3-4 column grid. Each card includes: Product image with hover zoom/flip, category tag, title, star rating with review count, price (with strike-through discount if on sale), and quick "Add to Cart" button.
  4. **Customer Reviews / Social Proof**: Testimonial carousel or 3-column masonry with verified buyer checkmarks and customer photos.
  5. **Sustainability / Brand Mission**: Clean full-width section explaining materials, ethics, or craftsmanship.

---

## 4. Creative Agency & Personal Portfolio

- **Visual Vibe**: Bold editorial typography, oversized display headlines, high contrast, clean minimalist borders, showcase focus.
- **Section Flow & Archetypes**:
  1. **Hero**: Huge typography, statement headline ("We build digital experiences that define categories"), availability badge ("Available for Q3 projects"), direct contact action.
  2. **Selected Work / Case Studies**: Large alternating cards. High-fidelity project preview image, client name, services rendered tags (Branding, Web Design, Next.js), and "View Project →" link.
  3. **Services Matrix**: 3-column clean cards detailing core offerings with deliverables list.
  4. **Client Testimonials**: Large quote statement from notable founders/leaders.
  5. **Interactive Inquiry Form**: Clean contact section with budget range selectors, email input, and submit button.
