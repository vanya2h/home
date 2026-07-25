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
