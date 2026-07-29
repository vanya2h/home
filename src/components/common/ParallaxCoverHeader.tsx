import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * How much of the cover stays pinned at the top of the viewport once the article has scrolled over it.
 * Keep the fallback `top-[calc(...)]` classes below in sync when changing this.
 */
const SLIVER = 20;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export type ParallaxCoverHeaderProps = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /** Rendered top-left over the cover, fading out with it. */
  children?: React.ReactNode;
};

/**
 * The cover scrolls away at exactly scroll speed, then stops with its bottom SLIVER px pinned to the
 * top of the viewport while the article scrolls on underneath.
 *
 * That's `position: sticky` with a *negative* top offset: at `top: SLIVER - height` the cover latches
 * exactly when its bottom edge reaches SLIVER px down the viewport, and the z-index keeps the article
 * passing beneath the strip that's left. Driving it by transform instead would mean recomputing every
 * frame to imitate the scrolling it already does for free; sticky is 1:1 by construction and can't
 * drift out of step with the article.
 *
 * The offset needs the cover's height, which is content-driven, so that one number is measured.
 * Everything else, the scroll included, is the browser's.
 */
export function ParallaxCoverHeader({ slug, title, excerpt, date, children }: ParallaxCoverHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const measure = () => setHeight(element.offsetHeight);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const textOpacity = useTransform(scrollY, (y) =>
    height === null || height <= SLIVER ? 1 : clamp01(1 - y / (height - SLIVER)),
  );

  return (
    <div
      ref={headerRef}
      className="sticky -top-59 z-30 border-b border-foreground/10 md:-top-75"
      style={height === null ? undefined : { top: SLIVER - height }}
    >
      <div className="min-h-64 md:min-h-80">
        <motion.div className="mx-auto w-full max-w-4xl px-6 pt-24 pb-6 md:px-12" style={{ opacity: textOpacity }}>
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
      </div>

      {children ? (
        <motion.div className="absolute inset-x-0 top-4 z-20" style={{ opacity: textOpacity }}>
          <div className="mx-auto w-full max-w-4xl px-6 md:px-12">{children}</div>
        </motion.div>
      ) : null}
    </div>
  );
}
