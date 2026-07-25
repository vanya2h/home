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
