import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Cover } from "@/components/common/Cover";

/** How much of the cover stays pinned at the top of the viewport once the article has scrolled over it. */
const SLIVER = 20;
/** Cover drift per pixel of scroll. Below 1, so the gradient lags the article and reads as further away. */
const DRIFT = 0.4;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export type ParallaxCoverHeaderProps = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /** Rendered top-left over the cover, drifting and fading with it. */
  children?: React.ReactNode;
};

/**
 * The cover is lifted out of the flow into a fixed strip whose height shrinks 1:1 with scroll,
 * down to a floor of SLIVER px. An empty spacer holds its place, so the article's top edge tracks
 * the strip's bottom edge exactly — flush at rest, then scrolling on underneath once the strip
 * bottoms out. Inside the strip the cover drifts up at DRIFT of scroll speed: that's the parallax.
 *
 * Sticky positioning can't do this. Sticky keeps the whole header pinned, and the article — which
 * moves at full speed — covers it completely; there's no way to hold back the last 40px.
 */
export function ParallaxCoverHeader({ slug, title, excerpt, date, children }: ParallaxCoverHeaderProps) {
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  // The cover's natural height, kept in a motion value so the transforms below re-run off it, and
  // in state so the spacer can reserve it. Measured rather than hardcoded: the height comes from
  // Tailwind's responsive classes on <Cover>, and a long title can push past them.
  const fullHeight = useMotionValue(0);
  const [spacerHeight, setSpacerHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = coverRef.current;
    if (!element) return;

    const measure = () => {
      fullHeight.set(element.offsetHeight);
      setSpacerHeight(element.offsetHeight);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [fullHeight]);

  const stripHeight = useTransform([scrollY, fullHeight], ([y, height]: number[]) => Math.max(SLIVER, height! - y!));

  const coverY = useTransform([scrollY, fullHeight], ([y, height]: number[]) =>
    reduceMotion ? 0 : -Math.min(y! * DRIFT, Math.max(0, height! - SLIVER)),
  );

  // Gone by the halfway mark, so the shrinking strip never clips through a line of text. Kept under
  // reduced motion — the clipping it avoids is worse than a fade, and a fade isn't the thing that
  // triggers motion sensitivity.
  const textOpacity = useTransform([scrollY, fullHeight], ([y, height]: number[]) =>
    height! > 0 ? clamp01(1 - y! / (height! / 2)) : 1,
  );

  return (
    <>
      {/* Holds the cover's place in the flow. Falls back to the cover's own heights until measured. */}
      <div
        aria-hidden
        className={spacerHeight === null ? "h-64 md:h-80" : undefined}
        style={spacerHeight === null ? undefined : { height: spacerHeight }}
      />

      <motion.div
        className="fixed inset-x-0 top-0 z-30 h-64 overflow-hidden border-b border-foreground/10 md:h-80"
        style={spacerHeight === null ? undefined : { height: stripHeight }}
      >
        <motion.div ref={coverRef} className="absolute inset-x-0 top-0" style={{ y: coverY }}>
          <Cover slug={slug} className="min-h-64 md:min-h-80">
            <motion.div className="max-w-3xl pt-12 pb-6" style={{ opacity: textOpacity }}>
              <h1 className="font-heading text-2xl leading-tight text-foreground md:text-4xl">{title}</h1>
              <p className="mt-3 md:text-lg text-foreground/80">{excerpt}</p>
              <p className="mt-4 text-foreground/60">
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          </Cover>

          {children ? (
            <motion.div className="absolute left-4 top-4 z-20" style={{ opacity: textOpacity }}>
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </motion.div>
    </>
  );
}
