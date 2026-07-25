# Blog section + MDX article pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a blog section to the home page listing MDX posts, plus on-site `/blog/:slug` article pages, shipping the first post ("Solving data-intensive React apps").

**Architecture:** MDX files with YAML frontmatter are compiled by an `@mdx-js/rollup` Vite plugin. A build-time `import.meta.glob` builds a typed, date-sorted post index (`src/lib/blog.ts`) shared by a home-page `<Blog />` section and a `/blog/:slug` route inside the existing layout (so the mesh-gradient background carries over). Prose is styled with hand-rolled Tailwind, code with `rehype-highlight`.

**Tech Stack:** React Router v7 (framework mode), Vite, Tailwind v4, `@mdx-js/rollup`, `remark-frontmatter`, `remark-mdx-frontmatter`, `remark-gfm`, `rehype-highlight`, `highlight.js` (theme CSS).

**Spec:** `docs/superpowers/specs/2026-07-25-blog-section-design.md`

**Repo note:** This is a single-package repo (no pnpm workspace). Run all commands from `/Users/vanya2h/Repos/home`. There is no test runner; verification uses `pnpm typegen` + `pnpm check-types`, `pnpm lint`, `pnpm build`, and manual dev checks. Commit messages follow Conventional Commits; do **not** add Co-Authored-By trailers.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `vite.config.ts` (modify) | Register the MDX plugin before `reactRouter()` |
| `types/mdx.d.ts` (create) | Ambient type for `*.mdx` imports (default component + `frontmatter`) |
| `src/content/blog/observables-in-react.mdx` (create) | First post: frontmatter + body |
| `public/blog/non-linear.png` (create) | Post image asset |
| `src/lib/blog.ts` (create) | Resolve + sort posts, `getPost(slug)` |
| `src/components/common/Blog.tsx` (create) | Home-page blog list section |
| `app/routes/blog/$slug.tsx` (create) | Render one article + meta + 404 |
| `app/routes.ts` (modify) | Register the `blog/:slug` child route |
| `app/routes/home/index.tsx` (modify) | Insert `<Section><Blog /></Section>` |
| `app/app.css` (modify) | `.prose-blog` styles + highlight.js theme import |

---

## Task 1: Install the MDX toolchain

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install dependencies**

Run from `/Users/vanya2h/Repos/home`:

```bash
pnpm add -D @mdx-js/rollup remark-frontmatter remark-mdx-frontmatter remark-gfm rehype-highlight highlight.js
```

- [ ] **Step 2: Verify they landed in devDependencies**

Run: `pnpm ls @mdx-js/rollup remark-frontmatter remark-mdx-frontmatter remark-gfm rehype-highlight highlight.js`
Expected: each resolves to an installed version (no "missing" lines).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add MDX toolchain deps"
```

---

## Task 2: Wire the MDX plugin into Vite

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Replace the file contents**

The MDX plugin MUST run before `reactRouter()`. Full new `vite.config.ts`:

```ts
import path from "node:path";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import rehypeHighlight from "rehype-highlight";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    __CV_BUILD_VERSION__: JSON.stringify(Date.now().toString(36)),
  },
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }], remarkGfm],
      rehypePlugins: [rehypeHighlight],
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
```

- [ ] **Step 2: Verify config parses**

Run: `pnpm typegen`
Expected: completes without a Vite/plugin resolution error.

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "build: wire MDX plugin into Vite"
```

---

## Task 3: Type `*.mdx` imports

**Files:**
- Create: `types/mdx.d.ts`

`types/**/*` is already in `tsconfig.vite.json`'s include, so no tsconfig change is needed.

- [ ] **Step 1: Create the ambient declaration**

```ts
declare module "*.mdx" {
  import type { ComponentType } from "react";

  export interface Frontmatter {
    title: string;
    date: string;
    excerpt: string;
    slug: string;
  }

  export const frontmatter: Frontmatter;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
```

- [ ] **Step 2: Commit**

```bash
git add types/mdx.d.ts
git commit -m "feat: type .mdx module imports"
```

---

## Task 4: Add the first post content + asset

**Files:**
- Create: `src/content/blog/observables-in-react.mdx`
- Create: `public/blog/non-linear.png`

- [ ] **Step 1: Create the content directory and copy the source**

```bash
mkdir -p src/content/blog public/blog
cp /Users/vanya2h/Repos/rxfy/.private/observables-in-react.md src/content/blog/observables-in-react.mdx
cp /Users/vanya2h/Repos/rxfy/.private/assets/non-linear.png public/blog/non-linear.png
```

- [ ] **Step 2: Prepend frontmatter to the MDX file**

Insert this block as the very first lines of `src/content/blog/observables-in-react.mdx` (before the existing `# Solving data-intensive React apps` heading):

```yaml
---
title: "Solving data-intensive React apps"
date: "2026-07-25"
excerpt: "Keeping the same data in sync across many views is where data-intensive React apps get hard. Here's the problem, and the single-source-of-truth solution I built."
slug: "observables-in-react"
---

```

- [ ] **Step 3: Fix the image path**

In `src/content/blog/observables-in-react.mdx`, change the image reference from the relative asset path to the public path. Find the line containing `![` ... `](./assets/non-linear.png)` and replace `./assets/non-linear.png` with `/blog/non-linear.png`. Run to confirm zero remaining relative refs:

Run: `grep -c "./assets/non-linear.png" src/content/blog/observables-in-react.mdx`
Expected: `0`

- [ ] **Step 4: Sanity-check MDX-hostile characters**

Fenced code blocks (```` ```ts ````, ```` ```tsx ````) are left untouched by MDX, so their `{`/`<` are safe. Confirm no bare `<` or `{` appears in prose (outside code fences) that MDX would misparse as JSX:

Run: `grep -nE '(^|[^`])[<{]' src/content/blog/observables-in-react.mdx | grep -vE '^\s*```' | head`
Expected: only matches inside indented/fenced code or none in prose. If a prose line has a stray `<`/`{`, escape it (e.g. `` `<` ``) — the current source's braces are all inside code fences, so expect no prose hits.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog/observables-in-react.mdx public/blog/non-linear.png
git commit -m "content: add first blog post (observables in react)"
```

---

## Task 5: Build the post index

**Files:**
- Create: `src/lib/blog.ts`

- [ ] **Step 1: Create the index module**

```ts
import type { ComponentType } from "react";

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

export interface Post extends PostFrontmatter {
  Component: ComponentType;
}

const modules = import.meta.glob<{
  default: ComponentType;
  frontmatter: PostFrontmatter;
}>("../content/blog/*.mdx", { eager: true });

export const posts: Post[] = Object.values(modules)
  .map((m) => ({ ...m.frontmatter, Component: m.default }))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Verify types resolve**

Run: `pnpm check-types`
Expected: PASS (no errors). This confirms the `*.mdx` glob, ambient types, and frontmatter shape all line up.

- [ ] **Step 3: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: add blog post index"
```

---

## Task 6: Home-page blog section

**Files:**
- Create: `src/components/common/Blog.tsx`

Mirrors the reveal pattern used in `src/components/common/MyProfile.tsx` (`useScrollReveal` + `animate-mask-reveal-up` stagger) and the `Card` aesthetic from `app/routes/home/index.tsx`.

- [ ] **Step 1: Create the component**

```tsx
import { Link } from "react-router";

import { H2 } from "@/components/typography";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { posts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function Blog() {
  const { ref, state } = useScrollReveal();

  return (
    <div ref={ref} className="flex w-full flex-col">
      <H2 className="mb-6 text-foreground/90">Writing</H2>
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={cn("block", state === "visible" && "animate-mask-reveal-up")}
            style={
              state === "hidden"
                ? { opacity: 0 }
                : state === "visible"
                  ? { animationDelay: `${i * 120}ms` }
                  : undefined
            }
          >
            <Card className="transition-colors hover:bg-card/80">
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription className="text-sm text-white/50">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
                <CardDescription className="mt-2 text-white/70">{post.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `pnpm check-types`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/Blog.tsx
git commit -m "feat: add blog list section component"
```

---

## Task 7: Mount the section on the home page

**Files:**
- Modify: `app/routes/home/index.tsx`

- [ ] **Step 1: Add the import**

At the top of `app/routes/home/index.tsx`, alongside the other `@/components/common/*` imports (after the `MyProfile` import line), add:

```tsx
import { Blog } from "@/components/common/Blog";
```

- [ ] **Step 2: Insert the section**

In the `Home()` component's JSX, insert a new `<Section>` between the `OpenSource` section and the `NFTSection` (hidden) section. The result should read:

```tsx
      <Section>
        <OpenSource />
      </Section>
      <Section>
        <Blog />
      </Section>
      <Section className="hidden">
        <NFTSection />
      </Section>
```

- [ ] **Step 3: Verify types**

Run: `pnpm check-types`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/routes/home/index.tsx
git commit -m "feat: mount blog section on home page"
```

---

## Task 8: Article route

**Files:**
- Create: `app/routes/blog/$slug.tsx`
- Modify: `app/routes.ts`

- [ ] **Step 1: Register the child route**

Replace the `/` route block in `app/routes.ts` so the blog route is a child of the layout (background carries over):

```ts
import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.tsx", [
    index("routes/home/index.tsx"),
    route("blog/:slug", "routes/blog/$slug.tsx"),
  ]),
  route("cv.pdf", "routes/cv-pdf.tsx"),
  route("cover-letter-gnosis-pay.pdf", "routes/cover-letter-gnosis-pay-pdf.tsx"),
  route("cover-letter-speechify.pdf", "routes/cover-letter-speechify-pdf.tsx"),
  route("cover-letter-onramper.pdf", "routes/cover-letter-onramper-pdf.tsx"),
] satisfies RouteConfig;
```

- [ ] **Step 2: Regenerate route types**

Run: `pnpm typegen`
Expected: completes; generates `./+types` for the new route.

- [ ] **Step 3: Create the route component**

`app/routes/blog/$slug.tsx`. The loader resolves frontmatter (serializable) for `meta()`; the component re-resolves the post to render the (non-serializable) MDX Component. The MeshGradient is rendered here to match the home page (the layout `<Outlet>` is bare). Background params copied from `app/routes/home/index.tsx`.

```tsx
import { MeshGradient } from "@paper-design/shaders-react";
import { ArrowLeft } from "lucide-react";
import { Link, type LoaderFunctionArgs, isRouteErrorResponse, useRouteError } from "react-router";
import type { Route } from "./+types";

import { Containers, Row } from "@/components/common/Container";
import { DashedBorder } from "@/components/common/DashedBorder";
import { AnchorUnderline } from "@/components/typography";
import { getPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPost(params.slug!);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return {
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    slug: post.slug,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Post not found" }];
  }
  return [{ title: `${data.title} — Vanya2h` }, { name: "description", content: data.excerpt }];
}

function Shell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <MeshGradient
        className="fixed inset-0 -z-10 w-full h-full animate-[fadeIn_1s_ease-in-out_forwards]"
        colors={["#38265f", "#7b28af", "#ff5297", "#9f50d3"]}
        distortion={1}
        swirl={0.8}
        grainMixer={0}
        grainOverlay={0.16}
        speed={0.6}
        scale={0.68}
        rotation={152}
      />
      <section className="flex min-h-screen p-2 md:p-4">
        <div className="flex w-full relative">
          <DashedBorder />
          <Containers>
            <Row className="relative">
              <div className={cn("mx-auto w-full max-w-2xl py-8", className)}>{children}</div>
            </Row>
          </Containers>
        </div>
      </section>
    </div>
  );
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const post = getPost(loaderData.slug);
  if (!post) return null;
  const { Component } = post;

  return (
    <Shell>
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white/90">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <article className="prose-blog">
        <Component />
      </article>
    </Shell>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <Shell className="text-center">
      <h1 className="text-2xl font-heading mb-4">{is404 ? "Post not found" : "Something went wrong"}</h1>
      <p className="text-white/70">
        <AnchorUnderline href="/">Back to home</AnchorUnderline>
      </p>
    </Shell>
  );
}
```

- [ ] **Step 4: Verify types**

Run: `pnpm typegen && pnpm check-types`
Expected: PASS. If `Route.ComponentProps`/`Route.MetaArgs` are missing, `typegen` must have created `app/routes/blog/+types` — confirm the file exists.

- [ ] **Step 5: Commit**

```bash
git add app/routes.ts app/routes/blog/$slug.tsx
git commit -m "feat: add blog article route"
```

---

## Task 9: Prose + code styling

**Files:**
- Modify: `app/app.css`

- [ ] **Step 1: Import a highlight.js theme**

At the very top of `app/app.css` (with the other `@import` lines), add:

```css
@import "highlight.js/styles/atom-one-dark.css";
```

- [ ] **Step 2: Add the `.prose-blog` styles**

Append to the end of `app/app.css`:

```css
.prose-blog {
  color: rgb(255 255 255 / 0.85);
  line-height: 1.75;
}
.prose-blog h1 {
  font-family: var(--font-heading, inherit);
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 1.5rem;
}
.prose-blog h2 {
  font-family: var(--font-heading, inherit);
  font-size: 1.5rem;
  margin: 2.5rem 0 1rem;
}
.prose-blog h3 {
  font-family: var(--font-heading, inherit);
  font-size: 1.2rem;
  margin: 2rem 0 0.75rem;
}
.prose-blog p {
  margin: 0 0 1.25rem;
}
.prose-blog ul,
.prose-blog ol {
  margin: 0 0 1.25rem;
  padding-left: 1.5rem;
  list-style: disc;
}
.prose-blog ol {
  list-style: decimal;
}
.prose-blog li {
  margin: 0.25rem 0;
}
.prose-blog a {
  color: rgb(255 255 255 / 0.9);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose-blog strong {
  color: white;
  font-weight: 600;
}
.prose-blog blockquote {
  border-left: 2px solid rgb(255 255 255 / 0.25);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: rgb(255 255 255 / 0.7);
  font-style: italic;
}
.prose-blog img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
.prose-blog :not(pre) > code {
  background: rgb(255 255 255 / 0.1);
  padding: 0.15em 0.4em;
  border-radius: 0.3rem;
  font-size: 0.9em;
}
.prose-blog pre {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  background: rgb(0 0 0 / 0.4);
  font-size: 0.85rem;
  line-height: 1.6;
}
.prose-blog pre code {
  background: transparent;
  padding: 0;
}
```

Note: `--font-heading` is referenced with an `inherit` fallback so it degrades gracefully if the token isn't defined as a CSS variable.

- [ ] **Step 3: Commit**

```bash
git add app/app.css
git commit -m "style: add blog prose and code styling"
```

---

## Task 10: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Type + lint + build**

```bash
pnpm typegen && pnpm check-types && pnpm lint && pnpm build
```
Expected: all four succeed. The `build` step is the real MDX check — it compiles the post for both SSR and client bundles.

- [ ] **Step 2: Manual dev check**

Run: `pnpm dev`, open the site.
Expected:
- Home page shows a "Writing" section (after Open Source) with one post card: title, formatted date, excerpt.
- Clicking the card navigates to `/blog/observables-in-react`.
- The article renders: heading, prose, the `non-linear.png` image, and syntax-highlighted `ts`/`tsx` code blocks, over the mesh-gradient background.
- The "← Back" link returns to the home page.
- Visiting `/blog/does-not-exist` shows the "Post not found" state with a working home link.

- [ ] **Step 3: Final commit (only if any fixups were needed)**

```bash
git add -A
git commit -m "fix: blog verification fixups"
```
(Skip if the working tree is clean.)

---

## Self-Review Notes

- **Spec coverage:** MDX pipeline (Task 1–2), content structure + ambient types (Task 3–5), home section (Task 6–7), article route + 404 (Task 8), prose/highlight styling (Task 9), verification (Task 10). All spec sections mapped.
- **Type consistency:** `PostFrontmatter`/`Post`/`getPost`/`posts` defined in Task 5 and used identically in Tasks 6 and 8. The ambient `Frontmatter` (Task 3) and `PostFrontmatter` (Task 5) share the same four fields; `blog.ts` re-declares its own exported `PostFrontmatter` rather than importing from the ambient module (ambient module types can't be imported by value), which is intentional.
- **Placeholders:** none — every code step contains complete content.
