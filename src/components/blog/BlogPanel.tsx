import { cn } from "@/lib/utils";

/**
 * The frame shared by the standalone blocks that punctuate a post — callouts, figures, tables.
 *
 * Covers the surface only: `not-prose`, border, background, radius, padding. Outer spacing stays at
 * the call site, since how much room a block needs depends on what sits around it, not on the frame.
 */
export type BlogPanelProps = React.ComponentProps<"div"> & {
  /** Match the element to the content's role — `figure` for a captioned graphic, `aside` for a tangent. */
  as?: "div" | "aside" | "figure" | "section";
};

export function BlogPanel({ as: Component = "div", className, ...restProps }: BlogPanelProps) {
  return (
    <Component
      className={cn(
        "not-prose overflow-hidden rounded-2xl border border-foreground/20 bg-background/50 p-6 sm:p-8",
        className,
      )}
      {...restProps}
    />
  );
}
