# Interactive Live Editing Guidelines

You are editing a Next.js project that is currently running in a Live Preview mode (via `npm run dev`) using Fast Refresh.

When applying modifications requested by the user, keep the following in mind:

1. **Targeted Modifications**: Do not rewrite the entire file if you only need to change a color, spacing, or add a single component. Make precise edits.
2. **Preserve Next.js Conventions**: Keep `export default function` for pages and layouts. Maintain "use client" directives where applicable.
3. **Tailwind CSS**: The project uses Tailwind CSS. Rely on standard utility classes. If the user asks for color changes, stick to Tailwind's robust color palette (e.g., `bg-rose-500`, `text-amber-300`).
4. **Immediate Feedback**: Because the user is viewing this live in an iframe, the layout should not be fundamentally broken. Ensure your JSX syntax is correct so the dev server does not crash.
5. **No Placeholders**: If adding new UI sections (like a Pricing table), write the actual code with sensible defaults rather than leaving a `// TODO: add pricing here` comment. The user wants to see the visual result immediately.
