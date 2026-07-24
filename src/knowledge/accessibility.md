# Accessibility & WCAG AA Checklist

Accessibility must not be an afterthought. All output websites must follow WCAG AA guidelines.

---

## 1. Semantic Markup Hierarchy

Use proper HTML5 semantic elements rather than generic `div` tags for structural layout.

- **`<header>`**: Global site header, holds branding and navigation.
- **`<nav>`**: Primary navigation blocks (always assign an `aria-label="Primary Navigation"` if there are multiple navs).
- **`<main>`**: The main, single content container of the page.
- **`<section>`**: Logical groupings of content. Always include a heading (`h2` or `h3`) within every section.
- **`<footer>`**: Global footer layout.
- **`<article>`**: Self-contained content blocks (blog posts, testimonials cards).

---

## 2. Keyboard Navigation & Focus Rings

- **Focus Indicators**: Every interactive element (buttons, links, text fields, checkboxes) must have a clearly visible focus style when navigated using a keyboard.
  - Tailwind default class: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- **Keyboard Triggers**: Interactive cards must use actual semantic HTML tags (like `<button>` or `<a>`) to guarantee they are focusable by tab keys. Never assign `onClick` to a `div` without also adding `role="button"` and `tabIndex={0}`.

---

## 3. ARIA Roles & Screen Reader Labels

- **Icon-Only Buttons**: Buttons that contain only icons (e.g., Close button, Hamburger menu) must have an explicit `aria-label` or visually hidden text:
  ```typescript
  <button aria-label="Close menu">
    <XIcon className="h-5 w-5" />
  </button>
  ```
- **Aria-Expanded**: Toggle elements (mobile menus, accordions) must track active states using `aria-expanded="true/false"`.
- **Visually Hidden Utility**: Use Tailwind's `sr-only` class to provide descriptive context to screen readers without rendering them on the visual UI.
  ```typescript
  <span className="sr-only">External link</span>
  ```

---

## 4. Alternative Text & Forms

- **Alt Tags**: Every image must include an `alt` attribute. If the image is purely decorative, use an empty string (`alt=""`) so screen readers bypass it.
- **Form Controls**: Every text input, select list, or checkbox must have a corresponding `<label>` tag. If visual labels are omitted for design reasons, use `aria-label` on the input element.
  - Inputs must also state status using attributes like `aria-invalid` or `aria-required`.
- **Contrast Check**: Never overlay white text directly on a bright background image. Use dark overlay masks (`bg-black/40`) to maintain a safe text contrast ratio.
