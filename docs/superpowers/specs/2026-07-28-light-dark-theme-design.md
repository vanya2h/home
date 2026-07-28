# Light/Dark Theme, Animated Toggler, and Scroll Progress

Date: 2026-07-28

## Goal

Add a light theme to a site that is currently dark-only, plus two magicui components: an
animated theme toggler fixed at the bottom-left, and a scroll progress bar pinned to the top
of the viewport.

## Background

The site has no theme system. `app/app.css` declares `@custom-variant dark (&:is(.dark *))`,
but nothing ever sets a `dark` class, and only four `dark:` utilities exist in the codebase —
vestigial shadcn defaults in `Badge`, `Button`, and `Tabs`.

Colors are largely hardcoded rather than tokenized: `body` is `bg-zinc-950`, `PageBackground`
paints a `zinc-950` base under white-alpha grid strokes, and the blog surface uses literal
`bg-black/70`, `border-white/10`, and `text-white/40`. A survey found **67 hardcoded color
occurrences across 15 files** outside `src/cv/`.

Dropping the toggler in as-is would animate and swap its icon while the page stayed visually
identical, because there is nothing for the `dark` class to change. A real light theme is
therefore the bulk of this work; the two components are comparatively small.

## Decisions

| Decision | Choice |
| --- | --- |
| Scope | Full light theme, not a toggle-only scaffold |
| Light-mode look | Mirror the dark look — same structure, inverted values |
| First-visit default | Follow OS `prefers-color-scheme` |
| Toggler appearance | Glass pill: circular ~40px, backdrop-blur, hairline border |
| Transition shape | `circle`, 400ms |
| Unused blog charts | Delete, along with the now-orphaned `dither-kit` |

## Out of scope

The CV and cover-letter PDF routes and `app/routes/og.tsx` render server-side through
`@react-pdf/renderer` and satori. They have no DOM and no theme class, so they are unaffected
and must not be touched.

## Dependencies

None to add. `AnimatedThemeToggler` needs `lucide-react` and `ScrollProgress` needs `motion`;
both are already in `package.json`.

Four dependencies are **removed** — see "Deletions".

---

## 1. Theme plumbing

The source of truth is the `dark` class on `<html>`, which `app/app.css:5` is already wired
for.

**No-flash script.** An inline, blocking `<script>` in the `<head>` of `app/root.tsx`, placed
before `<Links />` so it runs before first paint:

- read `localStorage.theme`; if it is `"dark"` or `"light"`, apply it
- otherwise fall back to `matchMedia("(prefers-color-scheme: dark)")`
- add or remove the `dark` class on `document.documentElement` accordingly
- wrap in `try/catch` — `localStorage` throws in some privacy modes

Add `suppressHydrationWarning` to the `<html>` element, since the script mutates it before
React hydrates.

**Following the OS.** A small effect subscribes to `matchMedia("(prefers-color-scheme: dark)")`
and updates the class on change, but **only while `localStorage.theme` is unset**. Once the
visitor toggles explicitly, their choice wins and the OS is ignored.

**Persistence.** The toggler runs in uncontrolled mode and writes `localStorage.theme` itself.
No `next-themes` or equivalent is introduced. The no-flash script and the component must agree
on the key `theme` and the values `"dark"` / `"light"`.

## 2. Token layer

In `app/app.css`, split the existing `:root` block into two sets:

- `:root` — the light values
- `.dark` — the current values, moved verbatim

The `@theme inline` block that maps `--color-*` to `--*` stays as-is; it already indirects
through the variables, so both sets flow through automatically.

Add tokens the current palette lacks, defined in both sets:

| Token | Purpose | Replaces |
| --- | --- | --- |
| `--surface` | Card and figure fill | `bg-white/5`, `bg-black/70`, `bg-black/50` |
| `--surface-border` | Hairline borders on those surfaces | `border-white/10`, `border-white/15` |
| `--surface-hover` | Hover fill for interactive cards | `hover:bg-white/10` |
| `--grid-line` | `GridPattern` stroke and fill | `fill-white/2 stroke-white/6` |

Register each in `@theme inline` as `--color-surface`, `--color-surface-border`, and so on, so
Tailwind generates `bg-surface`, `border-surface-border`, `stroke-grid-line`.

The light values mirror the dark ones: near-white base (`zinc-50`) instead of `zinc-950`,
black-alpha grid instead of white-alpha, near-black foreground instead of near-white.

**`body`.** `app/app.css` sets `@apply bg-zinc-950` with a comment explaining it matches the
`PageBackground` base so overscroll does not flash a different color. This becomes
`bg-background`, and the comment stays accurate.

## 3. Component migration

Replace the hardcoded literals with the new tokens across:

- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/common/OpenSource.tsx`
- `src/components/common/Blog.tsx`
- `src/components/common/Cover.tsx`
- `src/components/common/PageBackground.tsx`
- `src/components/blog/InvalidationMatrix.tsx`
- `src/components/blog/RxfyCallout.tsx`
- `app/routes/home/index.tsx`
- `app/routes/blog/$slug.tsx`

Mapping: `bg-black/70` and `bg-white/5` → `bg-surface`; `border-white/10` and `border-white/15`
→ `border-surface-border`; `text-white/40` and `text-white/50` → `text-muted-foreground`;
`text-white` → `text-foreground`.

**`.prose-blog`.** Its rules use literal `rgb(255 255 255 / …)` for body text, links, `strong`,
blockquotes, and inline code. Rewrite them as `color-mix(in srgb, var(--foreground) N%,
transparent)` so they track the active theme. The `pre` block keeps a dark background in both
themes — see below.

**Contrast.** Every migrated surface must clear WCAG AA (4.5:1 for body text, 3:1 for large
text and UI borders) in both themes. Light-mode values that fail get darkened until they pass;
do not ship a mirrored value that only looks right in dark.

## 4. Special cases

These need more than a token swap.

**Shared `useIsDark()` hook.** Two components below need the theme as a JavaScript *value*, not
as a CSS cascade — they pass colors into non-CSS APIs (a WebGL shader and a diagram generator)
that CSS variables cannot reach. Add one hook in `src/hooks/`:

- returns whether `document.documentElement` currently carries the `dark` class
- keeps it current with a `MutationObserver` on `attributeFilter: ["class"]`, disconnected on
  unmount
- returns the dark value during SSR and initial hydration, matching the site's current
  appearance, so the server and client markup agree

This is the same observer pattern the vendored toggler uses internally; keeping it in one hook
avoids a third copy.

**`MeshBackground`.** `src/lib/gradient.ts` returns `colorBack: "#00000080"`, which darkens the
backdrop behind the gradient, and `MeshBackground` renders at `opacity: 0.3`. In light mode
`colorBack` must become `#ffffff80` and opacity should drop to roughly `0.22` so text stays
readable over it.

These two need different mechanisms. `opacity` is applied via `style`, so it can read a CSS
variable and follow the class with no re-render. `colorBack` cannot — it is a prop consumed as
a shader uniform by `GrainGradient`, so it must come from `useIsDark()` and re-render. Have
`gradientForSlug` take the theme and return the matching `colorBack`, keeping the color logic
in one place.

The generated `colors` array is unchanged — its HSL values sit at 50–62% lightness and read
acceptably against both bases.

**`Mermaid`.** `src/components/common/Mermaid.tsx:18` hardcodes `theme: "dark"` in
`mermaid.initialize`, followed by a block of dark `themeVariables`. Mermaid generates the SVG
once inside a `useEffect`, so CSS variables never reach it either. Drive it from `useIsDark()`,
add a light `themeVariables` set alongside the existing dark one, and add the flag to the
effect's dependency array so the diagram re-initializes and re-renders on change.

**Highlight.js.** `app/app.css:3` imports `highlight.js/styles/atom-one-dark.css`
unconditionally. Rather than swapping stylesheets, keep code blocks dark in both themes — a
dark `pre` on a light page reads as deliberate, and this avoids loading two syntax themes.
`.prose-blog pre` keeps its `rgb(0 0 0 / 0.75)` background as a literal, with a comment noting
the intent.

**`::selection`.** Currently `color: var(--color-blue-900)` on `background-color:
var(--color-pink-200)`. Verify it stays legible in light mode; adjust the light set if not.

## 5. The two magicui components

Both are vendored into `src/components/ui/` by copying the source from the magicui registry
(`https://magicui.design/r/<name>.json`). The registry targets `@/components/ui` and a `cn`
helper, both of which match this repo, so the source needs no import rewriting.

Do **not** run `shadcn add` — there is no `components.json` in this repo, and adding one to
install two files is not worth the config surface.

### `AnimatedThemeToggler`

Uncontrolled mode, `variant="circle"`, `duration={400}`. It toggles the `dark` class inside
`document.startViewTransition`, then animates a clip-path on `::view-transition-new(root)`
expanding from the button's center.

Its required CSS goes into `app/app.css`:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

**Placement.** Fixed `bottom-6 left-6 z-50`, offset by `env(safe-area-inset-bottom)` and
`env(safe-area-inset-left)` to match the insets `body` already applies. `z-50` clears the
background layers, which sit at `-z-30` through `-z-10`.

**Styling.** Circular, ~40px, `backdrop-blur`, translucent fill and hairline border drawn from
`--surface` and `--surface-border`, with a visible `focus-visible` ring.

**Two deviations from upstream**, both deliberate:

1. Upstream initializes `internalIsDark` to `false` and corrects it in an effect, so SSR emits
   the wrong icon for one frame. Replace the JS-conditional icon with CSS-driven visibility —
   `<Moon className="dark:hidden" />` and `<Sun className="hidden dark:block" />` — which is
   correct at first paint with no JS. Keep the `<span className="sr-only">Toggle theme</span>`.
2. Under `prefers-reduced-motion: reduce`, skip `startViewTransition` and apply the class
   directly. The component already falls back this way when the API is missing, so this reuses
   that path.

Record both deviations in a comment at the top of the vendored file, so a future update from
the registry does not silently revert them.

### `ScrollProgress`

Fixed `inset-x-0 top-0 z-50`, `origin-left`, `scaleX` bound to `useScroll().scrollYProgress`
from `motion/react`.

Two changes from upstream: `h-px` → `h-0.5`, since a 1px bar is nearly invisible on a hidpi
display; and `aria-hidden` on the element, as it is decorative and duplicates information the
scrollbar already conveys.

Its default gradient (`#A97CF8 → #F38CB8 → #FDCC92`) is kept unchanged in both themes — it
sits close to the existing `--primary` purple and `::selection` pink, and reads against both a
near-white and a near-black base.

**Mounting.** Both components mount in `Layout` in `app/root.tsx`, as siblings of
`<PageBackground />`, so they appear on every route.

## 6. Deletions

`InvalidationEdgesChart`, `NonLinearChart`, and `ConsistencyDecayChart` in
`src/components/blog/` have no importers — `grep` finds only their own definitions. Delete all
three.

They are also the only consumers of `src/components/dither-kit/` (24 files, 140K), so delete
that directory too, and drop the dependencies it alone pulls in: `d3-scale`, `d3-shape`,
`@types/d3-scale`, `@types/d3-shape`.

`InvalidationMatrix` and `RxfyCallout` are **retained** — both are imported and rendered by
`src/content/blog/solving-data-intensive-apps.mdx`. They are themed as part of section 3.

After deleting, re-run `grep -rn "dither-kit" src app` to confirm nothing dangles.

## 7. Verification

The repo has no test suite, so verification is types, lint, and a manual pass.

1. `pnpm check-types` — clean
2. `pnpm lint` — clean
3. `pnpm build` — succeeds, confirming the removed deps are genuinely unused
4. `pnpm dev`, then manually on `/` and `/blog/solving-data-intensive-apps`:
   - toggle animates as an expanding circle from the bottom-left button
   - both themes render correctly; no unreadable text, no invisible borders
   - reload persists the chosen theme
   - **no flash of the wrong theme on load** — the primary risk of the inline script
   - with `localStorage.theme` cleared, the OS setting is honored, and changing the OS setting
     live updates the page
   - the scroll bar tracks smoothly and reaches full width at the bottom of a long page
   - mermaid diagrams re-render legibly in both themes

Check the first paint in both a cold load and a hard refresh; the flash is easiest to miss on a
warm cache.

## Risks

- **Flash of wrong theme** is the highest-risk item. It depends on the inline script running
  before paint, which means it must be a blocking, non-`async`, non-`module` script placed in
  `<head>`.
- **Light-mode contrast.** Mirroring dark values numerically does not guarantee legibility;
  several surfaces will need hand-tuning, particularly text over the mesh gradient.
- **Mermaid re-render** adds a class observer to a component that currently renders once. Guard
  against re-render loops and make sure the effect cleans up.
