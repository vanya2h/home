# Open Source Libraries Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen "Open source" section to the home page that showcases all 13 packages from the `common` and `rxfy` monorepos as a mosaic bento grid, emphasizing `rxfy` and `form-factory`.

**Architecture:** A new self-contained `OpenSource` component (data + cards + grid) rendered inside the existing `Section` wrapper in `app/routes/home/index.tsx`, placed between `MyProfile` and `HireMeJumbotron`. Static content only — no loader, no data fetching, no new dependencies. Reuses the `Card` UI primitive, `useScrollReveal`, and existing animation utilities.

**Tech Stack:** React Router v7, React, Tailwind CSS v4, `cn()`, `@radix-ui/react-icons`.

---

## File Structure

- **Create:** `src/components/common/OpenSource.tsx` — `Pkg` type, package data array, config-package list, `PackageCard`, `ConfigChip`, and the exported `OpenSource` component (heading + mosaic grid).
- **Modify:** `app/routes/home/index.tsx` — import `OpenSource` and add one `<Section>` between the `MyProfile` and `HireMeJumbotron` sections.

No test suite exists in this repo (per `CLAUDE.md`). Verification is `pnpm check-types` (type safety) plus `pnpm dev` (visual check).

---

## Conventions used in this plan

- Card emphasis tiers: `hero` (rxfy, form-factory), `accent` (rxfy-react), `default` (all other libs).
- GitHub link shape: `https://github.com/vanya2h/<repo>/tree/main/packages/<name>` where `<repo>` is `common` or `rxfy`.
- Descriptions are intentionally short **placeholders** for the user to replace later. Each is prefixed-friendly plain text.

---

### Task 1: Create the OpenSource component

**Files:**
- Create: `src/components/common/OpenSource.tsx`

- [ ] **Step 1: Create the file with types, data, sub-components, and the exported component**

Create `src/components/common/OpenSource.tsx` with exactly this content:

```tsx
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { H2 } from "@/components/typography";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type PkgSize = "hero" | "accent" | "default";

type Pkg = {
  name: string;
  description: string;
  href: string;
  size: PkgSize;
  span: string; // md+ grid placement classes
};

const GH = "https://github.com/vanya2h";

// Order matters: this sequence tiles the 12-col grid with no gaps (see plan).
const packages: Pkg[] = [
  {
    name: "rxfy",
    description: "Minimalistic reactive state framework — declare typed models and query them as observables.",
    href: `${GH}/rxfy/tree/main/packages/rxfy`,
    size: "hero",
    span: "md:col-span-8 md:row-span-2",
  },
  {
    name: "form-factory",
    description: "Typed, composable form builder.",
    href: `${GH}/common/tree/main/packages/form-factory`,
    size: "hero",
    span: "md:col-span-4",
  },
  {
    name: "store",
    description: "Normalized reactive store core.",
    href: `${GH}/common/tree/main/packages/store`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "rxfy-react",
    description: "Official React bindings for rxfy, incl. Next.js App Router support.",
    href: `${GH}/rxfy/tree/main/packages/rxfy-react`,
    size: "accent",
    span: "md:col-span-4 md:row-span-2",
  },
  {
    name: "store-react",
    description: "React bindings for store.",
    href: `${GH}/common/tree/main/packages/store-react`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "async-actions",
    description: "Typed async action/state helpers.",
    href: `${GH}/common/tree/main/packages/async-actions`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "utils-rxjs",
    description: "RxJS utility operators and helpers.",
    href: `${GH}/common/tree/main/packages/utils-rxjs`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "utils-rxjs-react",
    description: "React hooks for RxJS observables.",
    href: `${GH}/common/tree/main/packages/utils-rxjs-react`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "utils-wagmi",
    description: "wagmi/viem utility helpers.",
    href: `${GH}/common/tree/main/packages/utils-wagmi`,
    size: "default",
    span: "md:col-span-6",
  },
  {
    name: "utils",
    description: "General-purpose TypeScript utilities.",
    href: `${GH}/common/tree/main/packages/utils`,
    size: "default",
    span: "md:col-span-6",
  },
];

const configs: { name: string; href: string }[] = [
  { name: "eslint-config", href: `${GH}/common/tree/main/packages/eslint-config` },
  { name: "prettier-config", href: `${GH}/common/tree/main/packages/prettier-config` },
  { name: "typescript-config", href: `${GH}/common/tree/main/packages/typescript-config` },
];

function PackageCard({ pkg, index, visible, hidden }: { pkg: Pkg; index: number; visible: boolean; hidden: boolean }) {
  const emphasized = pkg.size !== "default";

  return (
    <a
      href={pkg.href}
      target="_blank"
      rel="noreferrer"
      className={cn("group block", pkg.span, visible && "animate-soft-blur-in")}
      style={hidden ? { opacity: 0 } : visible ? { animationDelay: `${index * 60}ms` } : undefined}
    >
      <Card
        className={cn(
          "h-full transition-colors hover:border-white/40",
          emphasized && "bg-gradient-to-br from-[#ff5297]/25 to-[#9f50d3]/25 border-[#ff5297]/40",
        )}
      >
        <CardHeader>
          <CardTitle className={cn("font-heading", pkg.size === "hero" ? "text-3xl" : "text-xl")}>
            {pkg.name}
          </CardTitle>
          <CardDescription className={cn(pkg.size === "hero" ? "text-base" : "text-sm")}>
            {pkg.description}
          </CardDescription>
        </CardHeader>
        <div className="grow" />
        <CardFooter>
          <span className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors group-hover:text-foreground">
            <GitHubLogoIcon className="h-4 w-4" />
            View on GitHub
          </span>
        </CardFooter>
      </Card>
    </a>
  );
}

function ConfigChip({ config }: { config: { name: string; href: string } }) {
  return (
    <a
      href={config.href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/25 px-3 py-2 text-xs text-foreground/55 transition-colors hover:border-white/45 hover:text-foreground/80"
    >
      <GitHubLogoIcon className="h-3.5 w-3.5" />
      {config.name}
    </a>
  );
}

export function OpenSource() {
  const { ref, state } = useScrollReveal();
  const visible = state === "visible";
  const hidden = state === "hidden";

  return (
    <div ref={ref} className="w-full">
      <H2
        className={cn("mb-6 text-2xl font-heading tracking-wide text-foreground/90", visible && "animate-mask-reveal-up")}
        style={hidden ? { opacity: 0 } : undefined}
      >
        Open source
      </H2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:[grid-auto-rows:minmax(9rem,auto)]">
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.name} pkg={pkg} index={i} visible={visible} hidden={hidden} />
        ))}

        <div
          className={cn("flex flex-wrap gap-3 md:col-span-12", visible && "animate-soft-blur-in")}
          style={hidden ? { opacity: 0 } : visible ? { animationDelay: `${packages.length * 60}ms` } : undefined}
        >
          {configs.map((config) => (
            <ConfigChip key={config.name} config={config} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm check-types`
Expected: PASS (no errors). The new file is referenced nowhere yet, but it must compile on its own.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/OpenSource.tsx
git commit -m "feat: add OpenSource libraries bento component"
```

---

### Task 2: Wire the section into the home page

**Files:**
- Modify: `app/routes/home/index.tsx`

- [ ] **Step 1: Add the import**

In `app/routes/home/index.tsx`, add this import alongside the other `@/components/common` imports (near `import { MyProfile } from "@/components/common/MyProfile";`):

```tsx
import { OpenSource } from "@/components/common/OpenSource";
```

- [ ] **Step 2: Insert the section**

In the `Home` component's returned JSX, insert a new `Section` immediately after the `MyProfile` section and before the hidden `NFTSection`. The result should read:

```tsx
      <Section>
        <MyProfile />
      </Section>
      <Section>
        <OpenSource />
      </Section>
      <Section className="hidden">
        <NFTSection />
      </Section>
```

- [ ] **Step 3: Type-check**

Run: `pnpm check-types`
Expected: PASS (no errors).

- [ ] **Step 4: Visual verification**

Run: `pnpm dev` and open http://localhost:3000

Confirm:
- A new full-screen "Open source" section appears after "About me" (the `MyProfile` paragraphs) and before the "Let's connect" section.
- `rxfy` is the large top-left block; `form-factory` and `rxfy-react` are emphasized (gradient tint); the remaining libs fill the mosaic with no gaps on desktop.
- The three `*-config` packages appear as small dashed chips in a row at the bottom.
- On a narrow viewport the cards stack into a single column.
- Scrolling into the section triggers the staggered reveal animation.
- Each card/chip links to its GitHub folder in a new tab.

- [ ] **Step 5: Commit**

```bash
git add app/routes/home/index.tsx
git commit -m "feat: add open source section to home page"
```

---

## Notes for the implementer

- **Grid tiling:** The `packages` array order is load-bearing. With `grid-auto-rows` and the listed `col-span`/`row-span` values, normal (non-dense) auto-placement tiles all 10 cards plus the config row with no holes. If you reorder packages, re-verify the grid visually.
- **Descriptions are placeholders.** The user will replace the `description` strings after the scaffold lands — do not block on copy quality.
- **No new dependencies.** Everything used (`Card`, `useScrollReveal`, `H2`, `GitHubLogoIcon`, `cn`) already exists in the repo.
```
