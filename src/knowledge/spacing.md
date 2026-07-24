# Spacing System & Grid Rules

A clean, high-quality layout relies entirely on mathematical consistency in spacing. Random margin or padding values destroy design alignment and visual rhythm.

---

## 1. The 8px Spacing Scale

Every padding, margin, gap, and dimension must use a scale built on multiples of `8px` (or `4px` for tiny elements).

| Scale | Value (px) | Value (rem) | Usage |
|:---|:---|:---|:---|
| `1` | 4px | 0.25rem | Tiny details, small badge padding, inline gaps |
| `2` | 8px | 0.5rem | Small buttons padding, text label spacing |
| `3` | 12px | 0.75rem | Medium badge padding, card header gaps |
| `4` | 16px | 1.0rem | Standard padding for small components, buttons |
| `5` | 20px | 1.25rem | Custom card body padding |
| `6` | 24px | 1.5rem | Card inner padding, list item gaps |
| `8` | 32px | 2.0rem | Large component padding, input groupings |
| `10` | 40px | 2.5rem | Outer card padding, form layout spacing |
| `12` | 48px | 3.0rem | Large card spacing, feature title gaps |
| `16` | 64px | 4.0rem | Inner hero container padding |
| `20` | 80px | 5.0rem | Minor section spacing, footer top padding |
| `24` | 96px | 6.0rem | Standard section gaps (desktop) |
| `32` | 128px | 8.0rem | Large section gaps, hero top/bottom padding |

---

## 2. Container Sizing & Layout Widths

- **Content Container Max-Width**: Keep readability high. Main content sections must not stretch infinitely.
  - Standard Container: `max-w-7xl` (`1280px` or `80rem`).
  - Readability Content (text, blog posts): `max-w-3xl` (`768px` or `48rem`).
  - Wide Mockups/Dashboards: `max-w-8xl` (`1440px` or `90rem`).
- **Container Padding**:
  - Mobile: `px-4` or `px-6` (`16px` to `24px`).
  - Tablet/Desktop: `px-8` (`32px`).

---

## 3. Section Padding & Visual Rhythm

- **Hero Padding**:
  - Desktop: `pt-32 pb-24` or `py-36` to create breathing room above the content fold.
  - Mobile: `pt-20 pb-16` to ensure elements load on the initial screen.
- **Section Gaps (Vertical Margin)**:
  - Standard section separation: `py-24` (`96px`) or `py-32` (`128px`).
  - Minimal section separation (related components): `py-16` (`64px`).
  - Never allow two dark or colored sections to sit together without ample padding and alternating layout elements.

---

## 4. Grid and Flexbox Spacing

- **Standard Grid Gaps**:
  - Grids of 3-4 columns: `gap-6` (`24px`) or `gap-8` (`32px`).
  - Grids of 2 columns: `gap-8` (`32px`) or `gap-12` (`48px`).
- **Flexbox Gaps**:
  - Horizontal buttons row: `gap-3` or `gap-4`.
  - Icon + Text label: `gap-2` or `gap-3`.
  - Vertical list of items: `space-y-4` or `gap-4`.
