# Open Source Libraries Section — Design

**Date:** 2026-06-19
**Status:** Approved, ready for implementation planning

## Goal

Add a new full-screen section to the home page that showcases the open-source
libraries maintained across two monorepos, rendered as a bento grid with visual
emphasis on `rxfy` and `form-factory`.

## Placement

A new `Section` in [app/routes/home/index.tsx](../../../app/routes/home/index.tsx),
inserted **between `MyProfile` (the "About me" section) and `HireMeJumbotron`**.
It follows the existing `min-h-screen` full-screen section rhythm and is wrapped
in the same `Section` component as the others.

A single heading sits above the grid (e.g. **"Open source"**) with **no subtitle**.

## Component structure

- New component file: `src/components/common/OpenSource.tsx`, exporting `OpenSource`.
  - Rationale: `index.tsx` is already long; a dedicated file keeps it focused and
    mirrors how `MyProfile` lives in its own file. (The inline `NFTSection` is the
    counter-example we are intentionally not following.)
- The section in `index.tsx` renders `<Section><OpenSource /></Section>`.
- Purely static — **no loader changes, no data fetching, no new dependencies.**

## Data model

A typed array, defined in `OpenSource.tsx` (or a sibling `packages.ts`):

```ts
type Pkg = {
  name: string;
  description: string;   // placeholder — to be written by the user
  href: string;          // GitHub folder URL
  size: "hero" | "accent" | "default";
};
```

Emphasis tiers:

- `hero` (largest): **rxfy**, **form-factory**
- `accent` (medium): **rxfy-react**
- `default`: `store`, `store-react`, `async-actions`, `utils-rxjs`,
  `utils-rxjs-react`, `utils-wagmi`, `utils`

Config/tooling packages — `eslint-config`, `prettier-config`,
`typescript-config` — live in a **separate small list** and render as a
de-emphasized dashed **chip row** at the bottom of the grid, each linking to
GitHub.

**Descriptions are left as placeholders for the user to fill in.** The
implementation seeds each `description` with a short placeholder string.

### Links

- `common` packages: `https://github.com/vanya2h/common/tree/main/packages/<name>`
- `rxfy` packages: the rxfy repo equivalent.

Exact folder paths will be verified against the live repos during
implementation (the rxfy repo's `packages/` layout must be confirmed).

## Layout (Mosaic — option C)

Built on the existing `md:grid-cols-12` bento pattern already used by
`NFTSection`. Asymmetric, woven sizes:

- **rxfy** — `col-span-8`, spans 2 rows tall (centerpiece)
- **form-factory** — `col-span-4`
- **rxfy-react** — `col-span-4`, tall accent
- remaining `default` libs — a mix of `col-span-4` / `col-span-6` woven around
- config chips — `col-span-12` dashed row at the bottom

Exact spans / `row-span` + `grid-auto-rows` values get tuned during build to
achieve the mosaic while keeping the grid balanced.

**Mobile (`< md`):** single column; everything stacks. Hero/accent cards render
slightly taller than defaults but otherwise flow normally.

## Styling

- Each card = the existing `Card` UI primitive wrapped in an
  `<a target="_blank" rel="noreferrer">`.
- `hero` / `accent` cards get a pink→purple gradient tint matching the mesh
  gradient palette (`#ff5297` / `#9f50d3`); `default` cards use the standard
  translucent `Card` background.
- Config chips: small, dashed-border, reduced opacity.
- Styling via Tailwind v4 + `cn()`. No new dependencies.

## Animation

- The section reveals on scroll via the existing `useScrollReveal` hook (same
  pattern as `HireMeJumbotron`).
- Cards cascade in with a staggered `animate-soft-blur-in` /
  `animate-mask-reveal-up` (existing utilities), using incremental
  `animationDelay` per card.

## Verification

- No test suite exists in this repo.
- `pnpm check-types` for type safety.
- `pnpm dev` for a visual check of layout, emphasis, animation, and links.

## Out of scope

- npm install snippets / published-package metadata (not shown).
- Tech-stack badges per package.
- GitHub stars / live repo stats (static content only).
- Final description copy (user-provided after scaffold).
