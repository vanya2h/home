# Blog section + MDX article pages — design

**Date:** 2026-07-25
**Repo:** `@vanya2h/home` (React Router v7 framework mode, Vite, Tailwind v4)

## Goal

Introduce a personal blog on the homepage. Add a blog section to the home page that
lists posts, and full on-site article pages that render each post from an MDX source.
Ship with the first post: "Solving data-intensive React apps" (the rxfy article).

## Decisions (approved)

- **Scope:** home-page list section **plus** full `/blog/:slug` article pages.
- **Content model:** each post is an `.mdx` file with YAML frontmatter; a build-time
  glob collects them into a typed index.
- **Section style:** match the existing `Card` + `Section` + `DashedBorder` aesthetic
  and `useScrollReveal` stagger animation.
- **Syntax highlighting:** `rehype-highlight` (the flagship post is code-heavy).
- **Prose styling:** hand-rolled Tailwind classes (no `@tailwindcss/typography`),
  to stay dependency-light and match the custom `font-heading` / mesh-gradient look.
- **Placement:** section goes after `OpenSource`, before `HireMeJumbotron`.

## Architecture

### 1. MDX pipeline (Vite)

Add dev dependencies:

- `@mdx-js/rollup` — compiles `.mdx` to a React component (default export = body).
- `remark-frontmatter` + `remark-mdx-frontmatter` — expose YAML frontmatter as a
  named `frontmatter` export from each MDX module.
- `remark-gfm` — GitHub-flavored markdown (tables, strikethrough, autolinks).
- `rehype-highlight` — syntax highlighting for fenced code blocks (highlight.js).

Wire into [vite.config.ts](../../../vite.config.ts). The MDX plugin must run **before**
`reactRouter()`:

```ts
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

plugins: [
  tailwindcss(),
  mdx({
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
    rehypePlugins: [rehypeHighlight],
  }),
  reactRouter(),
  tsconfigPaths(),
],
```

A highlight.js CSS theme is imported once (e.g. in `app/app.css` or the article
route) so highlighted tokens are styled. Pick a theme that reads on the dark
mesh-gradient background (e.g. `github-dark` / `atom-one-dark`).

TypeScript: add an ambient module declaration for `*.mdx` so imports type-check
(default export `React.ComponentType`, named `frontmatter`). Place in `types/`.

### 2. Content structure

```
src/content/blog/observables-in-react.mdx   # frontmatter + body
public/blog/non-linear.png                   # asset, referenced as /blog/non-linear.png
src/lib/blog.ts                              # typed posts index
types/mdx.d.ts                               # ambient *.mdx module declaration
```

Frontmatter shape (per post):

```yaml
---
title: "Solving data-intensive React apps"
date: "2026-07-25"
excerpt: "Keeping the same data in sync across many views is where data-intensive React apps get hard. Here's the problem, and the single-source-of-truth solution I built."
slug: "observables-in-react"
---
```

`src/lib/blog.ts` collects posts:

```ts
import type { ComponentType } from "react";

interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

interface Post extends PostFrontmatter {
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

Eager glob is chosen deliberately: few posts, SSR-safe, and it lets both the list
and the article route share one resolved index with no async loader plumbing.

### 3. Home-page section — `<Blog />`

New `src/components/common/Blog.tsx`, dropped into [home/index.tsx](../../../app/routes/home/index.tsx)
as a `<Section>` between `OpenSource` and `HireMeJumbotron`:

```tsx
<Section>
  <Blog />
</Section>
```

Structure:

- A `CardTitle`/`H2`-topped heading for the section ("Writing" / "Blog").
- A vertical list of post cards. Each card: title (`CardTitle`), date + excerpt
  (`CardDescription`), wrapped in `<Link to={`/blog/${slug}`}>`.
- Uses `useScrollReveal()` and the same `animate-mask-reveal-up` stagger
  (`animationDelay: i * 120ms`, hidden→visible states) as `MyProfile` and
  `HireMeJumbotron`.
- Reads from `posts` in `src/lib/blog.ts`.

### 4. Article page — `/blog/:slug`

New route file `app/routes/blog/$slug.tsx`, registered in
[app/routes.ts](../../../app/routes.ts) **inside the existing layout route** so the
fixed mesh-gradient background carries over:

```ts
route("/", "routes/layout.tsx", [
  index("routes/home/index.tsx"),
  route("blog/:slug", "routes/blog/$slug.tsx"),
]),
```

Behavior:

- `loader({ params })` looks up the post via `getPost(params.slug)`; if missing,
  `throw new Response("Not found", { status: 404 })`. Returns the frontmatter
  (title/excerpt/date/slug) for `meta()` — **not** the Component (not serializable).
- The component resolves the post again from `getPost(slug)` on the client to render
  `<Component />` (the MDX body). The MeshGradient background is rendered here too
  (the layout `<Outlet>` is bare), matching the home page.
- Layout: `<Section>` → a centered, `max-w-*` prose container → `<Component />`,
  with a "← Back" `<Link to="/">` at the top.
- `meta()` sets `title` and `description` from the post's frontmatter.

### 5. Prose styling

No `@tailwindcss/typography`. Style the MDX output with a scoped wrapper class in
`app/app.css` (e.g. `.prose-blog h2 { ... }`, `p`, `ul`, `blockquote`, `code`,
`pre`, `img`, `a`) tuned for the dark mesh background, reusing `font-heading` for
headings and the existing muted-foreground / border tokens. Images get
`rounded-lg max-w-full`; `pre` gets padding, rounded corners, and horizontal scroll.

### 6. First post migration

- Copy `.private/observables-in-react.md` (from the **rxfy** repo) →
  `src/content/blog/observables-in-react.mdx` in this repo.
- Prepend the frontmatter block above.
- Rewrite the image reference `![...](./assets/non-linear.png)` →
  `![...](/blog/non-linear.png)`.
- Copy `non-linear.png` into `public/blog/`.
- Verify the MDX compiles: the `>` blockquote, fenced ` ```ts `/` ```tsx ` blocks,
  `###` headings, and the inline `**bold**` / `_italic_` all render. Note any raw
  `{` / `<` in prose that MDX would parse as JSX and escape if present (the source
  uses `ƒ(query)` etc. only in the home page, not this post; the post's braces are
  all inside fenced code, which MDX leaves untouched).

## Components & boundaries

| Unit | Responsibility | Depends on |
| --- | --- | --- |
| `src/content/blog/*.mdx` | Post content + frontmatter | MDX pipeline |
| `types/mdx.d.ts` | Type `.mdx` imports | — |
| `src/lib/blog.ts` | Resolve + sort posts, `getPost(slug)` | glob of `*.mdx` |
| `src/components/common/Blog.tsx` | Home-page list section | `blog.ts`, `Card`, `useScrollReveal` |
| `app/routes/blog/$slug.tsx` | Render one article + meta + 404 | `blog.ts`, `Section`, MeshGradient |
| `app/app.css` `.prose-blog` | MDX prose styling | Tailwind tokens |

## Error handling

- Unknown slug → `loader` throws a 404 `Response`; the nearest route ErrorBoundary
  (or a small local one) shows a "post not found" message with a link home.
- Missing/malformed frontmatter → surfaces at build/type time via `types/mdx.d.ts`
  and the `PostFrontmatter` shape in `blog.ts`.

## Testing / verification

No test runner is configured in this repo, so verification is manual + static:

- `pnpm --filter @vanya2h/home check-types` passes (MDX ambient types resolve).
- `pnpm --filter @vanya2h/home lint` passes.
- `pnpm --filter @vanya2h/home build` succeeds (MDX compiles under SSR + client).
- Dev run: home page shows the blog section; clicking the post navigates to
  `/blog/observables-in-react`; the article renders with the image, highlighted
  code blocks, and the mesh background; an unknown slug shows the 404 state.

## Out of scope

- Pagination / tags / categories (one post today).
- RSS feed, comments, reading-time, related posts.
- CMS or remote content — files only.
