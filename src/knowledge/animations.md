# Animation Rules & Framer Motion Guidelines

Animations must feel fast, natural, and premium. Slow, heavy, or unnecessary animations ruin the user experience and impact site performance.

---

## 1. Frame Motion Standards

All custom animations must use Framer Motion. Follow these configuration rules:

- **Prefer Orchestrated Entrance Animations**: Instead of all elements fading in at once, stagger list items and grid columns.
- **Limit Types of Animations**: Stick to two primary transitions:
  - Fade In: `opacity: 0` to `opacity: 1`.
  - Slide Up (fade + translate): `y: 20` to `y: 0` combined with fade-in.
- **Avoid Heavy Scales & Rotations**: Scaling or rotating elements during scroll looks messy. Keep scales subtle (e.g., hover scaling up from `1.0` to `1.02` max).

---

## 2. Speed & Easing Guidelines

Animations must never get in the way of a user completing a task.

- **Duration Scales**:
  - **Fast (150ms)**: Micro-interactions, hover states, button transitions, icon moves.
  - **Normal (200ms)**: Standard fade-ins, dropdown openings, tab switching.
  - **Slow (300ms)**: Large layout transitions, full-screen overlay expansions.
- **Easing System**:
  - For simple transitions, use `easeInOut` or `easeOut`.
  - For elements entering the screen, use custom cubic-beziers for a spring-like feel without bounce: `ease: [0.16, 1, 0.3, 1]` (custom easeOutExpo).
  - For spring animations (e.g., drawer/sidebar opening):
    `type: "spring", stiffness: 300, damping: 30`.

---

## 3. Scroll-Triggered Animations

- Use Framer Motion's `whileInView` or `viewport` settings to trigger animations only when they enter the view:
  ```typescript
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  ```
- **staggerChildren**: Grid items must enter one after another with a stagger delay of `0.05` to `0.1` seconds.

---

## 4. Accessibility & Reduced Motion

You must respect users who have enabled "prefers-reduced-motion" settings in their operating system.

- Import and use Framer Motion's `useReducedMotion` hook.
- If reduced motion is preferred, disable all positional transitions (`x`, `y`, `z`) and fall back to a simple `opacity` fade.
  ```typescript
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.2 };
  ```
- Alternatively, use CSS transition-based animations with Tailwind `motion-safe:` and `motion-reduce:` variants.
