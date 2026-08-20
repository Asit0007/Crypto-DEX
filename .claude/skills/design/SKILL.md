---
name: design
description: Crypto-DEX design system — dark palette, typography, spacing, and component conventions. Use whenever styling UI, building components, or making visual changes in this repo.
---

# Crypto-DEX Design System

Dark-only, modern DEX aesthetic. Heritage brand green `#21BF96` on near-black
ink surfaces, with a teal→blue gradient for brand moments.

## Palette (defined in `tailwind.config.js`)

| Token         | Hex       | Use                                          |
| ------------- | --------- | -------------------------------------------- |
| `ink`         | `#0B0E14` | Page background                              |
| `ink-raised`  | `#12161F` | Cards, modals, panels                        |
| `ink-overlay` | `#1A2029` | Nested panels, hover states, dropdowns       |
| `ink-border`  | `#232B38` | All borders and dividers                     |
| `fg`          | `#E6EAF2` | Primary text                                 |
| `fg-muted`    | `#94A3B8` | Secondary text, labels                       |
| `brand`       | `#21BF96` | Primary actions, active states, links        |
| `brand-light` | `#2ADFB2` | Hover on brand elements                      |
| `accent`      | `#38BDF8` | Gradient partner only — never alone as a CTA |

Brand gradient: `bg-gradient-to-r from-brand to-accent` (logo wordmark) and
`linear-gradient(135deg, #21bf96, #189d7b)` (primary buttons, set globally in
`src/index.css`).

## Typography

- Font: **Inter** (loaded in `index.html`), weights 400–800.
- Page titles: `text-2xl font-bold text-fg` with a leading emoji (💰, 💸, 🖼).
- Card titles: `text-lg font-bold`.
- Labels/metadata: `text-sm text-fg-muted`.
- Numbers users act on (amounts, quotes): `text-2xl font-semibold`.

## Shape & elevation

- Cards and modals: `rounded-2xl` (1rem) with `border-ink-border` and
  `shadow-card`. Nested input panels: `rounded-2xl bg-ink-overlay p-3`.
- Buttons and small controls: `rounded-xl`.
- Never use pure-white shadows or light-theme grays (`#e7eaf3` is banned —
  it's the old light theme).

## Component conventions

- **Ant Design v4 (dark)** provides behavior: `Modal`, `Table`, `Skeleton`,
  `notification`, `Dropdown`, `Timeline`. Global re-theming lives in
  `src/index.css` — extend it there rather than fighting antd inline.
- Feedback: **always** antd `notification` with `placement: "bottomRight"`.
  `window.alert()` is banned.
- Tables live inside `overflow-hidden rounded-2xl border border-ink-border
shadow-card` wrappers with `scroll={{ x: true }}`.
- Loading: antd `Skeleton` with `active`. Every data view needs a loading
  state; blank space while fetching is a bug.
- Images that can 404 (token logos, NFTs) always get a fallback
  (`FALLBACK_LOGO` pattern in `DEX.jsx` / `InchModal.jsx`).

## Layout

- App shell is in `src/App.jsx`: sticky blurred header
  (`bg-ink/80 backdrop-blur-md`), centered `<main>`, muted footer.
- Content widths: forms/cards `max-w-[430px]`–`[450px]`, tables/galleries
  `max-w-5xl`. Always `w-full` + `max-w-*`, never fixed pixel widths.
- Mobile-first: base styles are the narrow layout; add `sm:`/`md:`/`lg:`
  variants upward. Anything hidden on mobile needs a deliberate reason.

## Voice

Friendly, concise, honest. Emojis in nav and headings are part of the brand.
Never promise functionality that doesn't work — the QuickStart "Project
status" card is the model for honest messaging.
