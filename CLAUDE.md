# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm check-types  # TypeScript type checking
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm typegen      # Generate React Router types (run after changing routes.ts)
```

Package manager: **pnpm** (use `corepack pnpm install` for first-time setup). No test suite exists.

## Architecture

This is a personal homepage built with **React Router v7** (framework mode) + **Express**, using SSR. The entry point is `server.ts` which boots an Express server — in dev it uses Vite middleware, in prod it serves the built output.

**Two distinct source directories:**

- `app/` — React Router routes and route-level files (loaders, meta, default exports)
- `src/` — Reusable components, CV data, utilities (aliased as `@/` in imports)

**Routing** (`app/routes.ts`): flat file-based routes served by Express via `@react-router/express`. Routes include the homepage (`/`) and several PDF routes (`/cv.pdf`, `/cover-letter-*.pdf`).

**PDF generation**: Routes like `app/routes/cv-pdf.tsx` use `@react-pdf/renderer` to render PDF documents server-side in loaders, returning a `Response` with `Content-Type: application/pdf`. PDF content components live in `src/cv/`. CV data (experiences, skills) is in `src/cv/data.ts`.

**`__CV_BUILD_VERSION__`**: A global injected by Vite (`vite.config.ts`) as `Date.now().toString(36)` at build time. Used in the home page to bust CV PDF cache via query param (`/cv.pdf?v=...`).

**AppLoadContext**: Typed in `server/app.ts`. Currently exposes `NODE_ENV`. Add new context fields there and in the `declare module "react-router"` block.

**UI components** (`src/components/`):
- `ui/` — Radix-based primitives (Badge, Button, Card, Table, Tabs)
- `common/` — Composite components (Container layout, DashedBorder, DataTable with TanStack Table, MyProfile)
- `typography/` — Text primitives (H1, Paragraph, AnchorUnderline, InlineBadge)

**Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`), `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`.

**Blockchain/Web3**: `wagmi` + `viem` config in `src/wagmi/`. Moralis client in `src/moralis.ts`. The NFT section on the home page is currently hidden (`className="hidden"`).
