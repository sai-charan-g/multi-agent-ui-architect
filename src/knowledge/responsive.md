# Responsive Design & Mobile-First Guidelines

Modern websites must look perfect on mobile screens first, then scale up beautifully to large desktop displays.

---

## 1. Breakpoint System & Media Queries

Tailwind's default breakpoints must be used consistently.

| Breakpoint | Width (px) | Usage |
|:---|:---|:---|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets, small laptops |
| `lg` | 1024px | Standard desktop displays |
| `xl` | 1280px | Large desktop displays |
| `2xl` | 1536px | Ultra-wide displays |

Always code mobile layouts first (no breakpoint prefix), then add responsive overrides using `md:`, `lg:`, or `xl:` prefixes.

---

## 2. Grid & Flex Responsive Flow

- **Grid Columns**:
  - Grid columns must stack on mobile: `grid-cols-1`.
  - Step up columns at breakpoints: `md:grid-cols-2 lg:grid-cols-3`.
  - Example card grid: `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`.
- **Flex Direction**:
  - Horizontal blocks must stack vertically on mobile: `flex flex-col md:flex-row`.
  - Adjust alignments: `items-center justify-between text-center md:text-left`.

---

## 3. Responsive Typography

Headings must shrink on mobile screens to prevent text wraps or breaking outside screen edges.

- **H1 Display**:
  - Mobile: `text-3xl` or `text-4xl`
  - Desktop: `md:text-5xl lg:text-7xl`
- **H2 Section**:
  - Mobile: `text-2xl`
  - Desktop: `md:text-3xl lg:text-4xl`
- **Body / Subtext**:
  - Mobile: `text-base`
  - Desktop: `md:text-lg lg:text-xl`

---

## 4. Mobile Navigation Drawer

- The desktop horizontal nav menu must hide on mobile: `hidden md:flex`.
- The hamburger button must only be visible on mobile: `flex md:hidden`.
- The hamburger trigger must open a full-height overlay drawer (or slide-down drawer) with slide-in animations.
- Prevent background body scrolling when the mobile menu is open.

---

## 5. Sizing & Touch Targets

- **Touch Target Dimensions**: All mobile interactive elements (buttons, links, form inputs) must have a touch target of at least `44px` height and width. Use padding (`p-3`, `py-2 px-4`) to expand touch areas without bloating labels.
- **Image Responsiveness**: All images and illustrations must scale automatically: `w-full h-auto object-cover`. Use Next.js `Image` wrapper or standard responsive container wrappers.
