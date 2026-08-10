import base from "@vanya2h/prettier-config";

export default {
  ...base,
  overrides: [
    {
      // Reflow prose in plain markdown only.
      //
      // NOT .mdx: blog posts use raw inline <a href ...> tags, and wrapping a line
      // inside one makes MDX re-parse its children as block content — the link text
      // becomes a nested <p> and trailing punctuation splits into its own paragraph.
      // Verified by rendering before/after to HTML; see git history for the repro.
      files: "*.md",
      options: { proseWrap: "always" },
    },
  ],
};
