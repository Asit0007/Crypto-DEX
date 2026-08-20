---
name: tailwind
description: Tailwind CSS conventions for Crypto-DEX — how Tailwind coexists with Ant Design v4, token usage, and class patterns. Use when writing or editing any className, tailwind.config.js, or src/index.css.
---

# Tailwind in Crypto-DEX

Tailwind 3 handles **layout, spacing, color, and typography**. Ant Design v4
(dark theme) handles **behavior** (modals, tables, dropdowns, forms). Don't
rebuild antd components in Tailwind; don't use antd for plain layout.

## The two load-bearing rules

1. **Preflight is OFF** (`corePlugins: { preflight: false }` in
   `tailwind.config.js`) because antd owns the global reset. Consequences:
   - A minimal reset + `box-sizing` fix lives in `src/index.css`. Native
     elements may keep browser default styles — raw `<button>` needs
     `border-0 bg-transparent cursor-pointer` explicitly.
   - Border utilities (`border`, `border-b`) work because `src/index.css`
     sets the universal `border-style: solid; border-width: 0` reset. If a
     border doesn't render, check that reset is intact.
2. **Import order matters**: `antd/dist/antd.dark.css` is imported in
   `App.jsx`; `src/index.css` (Tailwind + overrides) is imported in
   `main.jsx` and must load **after** antd so equal-specificity overrides win.

## Tokens — never hardcode

Use the theme colors from `tailwind.config.js`: `ink`, `ink-raised`,
`ink-overlay`, `ink-border`, `fg`, `fg-muted`, `brand`, `brand-light`,
`accent`. Writing `bg-[#12161f]` instead of `bg-ink-raised` is a review
failure. New colors go into the config first.

## Styling antd components

- Prefer `className` on antd components — antd merges it onto the root node.
- Global re-theming (table headers, modal surfaces, menu underline, primary
  button gradient) lives in the override block of `src/index.css`. Extend
  that file for anything that should apply app-wide.
- `bodyStyle` / `style` props are acceptable for antd-internal nodes that
  `className` can't reach (e.g. `Modal bodyStyle={{ padding: 0 }}`).
- Use `!` important modifiers (`!block`) only as a last resort against antd
  specificity, and comment why.

## Patterns

- Cards: `rounded-2xl border border-ink-border bg-ink-raised p-4 shadow-card`
- Nested input panel: `rounded-2xl border border-ink-border bg-ink-overlay p-3`
- Page container: `w-full max-w-5xl px-1 py-2` (tables) or
  `w-full max-w-[430px]` (forms)
- Info row: `flex items-center justify-between gap-4 text-sm text-fg-muted`
- Responsive: mobile-first; `flex-col gap-4 lg:flex-row` for side-by-side
  cards that stack on small screens.

## Class order

Follow Prettier-style grouping: layout → flex/grid → spacing → size →
typography → color → border → effects → states. Keep `hover:`/`focus:`
variants last. One long className string is fine; don't split into arrays.

## Content globs

`tailwind.config.js` scans `index.html` and `src/**/*.{js,jsx}`. If a class
"doesn't work", first check the file is inside those globs and the class name
isn't built by string concatenation (Tailwind can't see dynamic names —
use full class names conditionally instead).
