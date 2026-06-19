# Open Source Section — Master–Detail Redesign

**Date:** 2026-06-19
**Status:** Approved, ready for implementation planning
**Supersedes:** the bento-grid layout in `2026-06-19-open-source-section-design.md` (the section, placement, full-width behavior, and data sourcing from that spec still hold; only the internal layout/interaction of `OpenSource` changes).

## Goal

Replace the bento-grid body of the home page "Open source" section with a
two-column master–detail layout: a menu of package titles on the left, and a
detail panel describing the hovered/selected package on the right.

## Scope

Rewrite the body of `src/components/common/OpenSource.tsx`. No changes to
`app/routes/home/index.tsx` (the section already renders `<Section fullWidth><OpenSource /></Section>`
between `MyProfile` and `HireMeJumbotron`). Static content only — no loader, no
data fetching, no new dependencies, no tests (no test suite in repo).

## Data model

```ts
type Pkg = {
  name: string;
  description: string;          // placeholder copy, user-editable
  href: string;                 // GitHub folder URL
  repo: "common" | "rxfy";      // drives the uppercase detail label
  tags: string[];               // tech pills — seeded placeholders, user-editable
};
```

The `size` and `span` fields from the bento version are removed.

Same 9 packages, same order (rxfy first): rxfy, form-factory, rxfy-react,
store-react, async-actions, utils-rxjs, utils-rxjs-react, utils-wagmi, utils.
(The `store` package and the three `*-config` packages remain excluded, per the
prior iteration.)

`href` values are unchanged: rxfy & rxfy-react →
`https://github.com/vanya2h/rxfy/tree/main/packages/<name>`; all others →
`https://github.com/vanya2h/common/tree/main/packages/<name>`.

Seed `tags` (placeholders, user may tweak):
- rxfy: RxJS, Zod, TypeScript, SSR
- form-factory: React, TypeScript, Forms
- rxfy-react: React, RxJS, Next.js
- store-react: React, RxJS
- async-actions: RxJS, TypeScript
- utils-rxjs: RxJS
- utils-rxjs-react: React, RxJS
- utils-wagmi: wagmi, viem
- utils: TypeScript

## State & interaction

`OpenSource` owns two pieces of state:

- `selected: number` — the pinned item index, default `0` (rxfy). Set on
  click/tap of a menu item.
- `hovered: number | null` — transient, default `null`. Set on `onMouseEnter`
  and `onFocus` of a menu item; cleared (`null`) on the menu container's
  `onMouseLeave`.

**Active package = `packages[hovered ?? selected]`.** Hover previews; leaving
the menu reverts to the pinned item; clicking re-pins. Touch devices (no hover)
fall back to click → `selected`.

## Components (all in `OpenSource.tsx`)

- **`OpenSource`** — renders the `H2` "Open source" heading and a
  `flex flex-col md:flex-row` container. Owns `selected`/`hovered` state and
  derives the active package. Uses `useScrollReveal` for the section reveal.
- **Menu** (left column) — a list of `<button>` elements, one per package title.
  - Container: `md:w-1/3`, `onMouseLeave` clears `hovered`.
  - Each button: `onMouseEnter`/`onFocus` → set `hovered`; `onClick` → set
    `selected`. The active button gets the pink→purple gradient
    (`bg-linear-to-br from-[#ff5297]/25 to-[#9f50d3]/25 border-[#ff5297]/40`)
    and `aria-current="true"`. Buttons are not links (selection ≠ navigation)
    and are keyboard-focusable.
- **Detail panel** (right column, `flex-1`) — for the active package:
  - Uppercase, low-emphasis repo label: `"<repo> monorepo"`.
  - Large `<h3>` package title.
  - Description paragraph.
  - Tag pills (rounded, translucent) from `tags`.
  - `View on GitHub` link — `<a href={active.href} target="_blank" rel="noreferrer">`
    with `GitHubLogoIcon`. This is the only outbound link.

## Layout & responsive

- Two columns on `md+` (`flex-row`); stacked on mobile (`flex-col`) with the
  menu on top and the detail panel below.
- Remains inside the existing full-width `Section`.

## Animation

- `useScrollReveal` drives the initial reveal of the heading and columns
  (opacity-0 when `hidden`, animate when `visible`, mirroring `MyProfile`).
- The detail panel content re-runs `animate-soft-blur-in` on active change via a
  React `key={active.name}` wrapper, producing a gentle content swap.

## Accessibility

- Page hierarchy: H1 (jumbotron) → H2 ("Open source") → H3 (active package
  title in the detail panel). Menu items are `<button>`s, not headings.
- Active menu button carries `aria-current="true"`.
- `onFocus` updates the preview so keyboard users get the same behavior as
  hover.

## Verification

- No test suite exists in this repo.
- `pnpm check-types` (no new errors; pre-existing generated-`types/` and
  `node_modules` errors are out of scope).
- `pnpm build` (client + SSR) succeeds.
- Visual check via `pnpm dev`: hover previews, click pins, rxfy preselected,
  tags/repo/link render, mobile stacks.

## Out of scope

- npm install snippets, GitHub stars / live stats.
- Re-adding `store` or the config packages.
- Final description/tag copy (user-provided).
