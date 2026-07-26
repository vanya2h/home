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

// Stamped once per build process (shared across the client + SSR passes) so the
// value is identical on both sides — used to cache-bust versioned URLs (CV,
// OG images) after each deploy without causing SSR/client hydration mismatches.
const BUILD_VERSION = Date.now().toString(36);

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    __CV_BUILD_VERSION__: JSON.stringify(BUILD_VERSION),
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
