import { motion, type MotionProps, useScroll } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Vendored from https://magicui.design/r/scroll-progress.json.
 *
 * Deviations from upstream, deliberate — keep them if you re-pull the registry source:
 *   - h-px -> h-0.5, since a 1px bar is nearly invisible on a hidpi display
 *   - aria-hidden, as it's decorative and duplicates what the scrollbar already conveys
 *
 * The gradient is upstream's default. It's kept for both themes: those hues sit close to
 * --primary and the ::selection pink, and read against a near-white and a near-black base.
 */
interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>;
}

export function ScrollProgress({ className, ref, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-linear-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className,
      )}
      ref={ref}
      style={{ scaleX: scrollYProgress }}
      {...props}
    />
  );
}
