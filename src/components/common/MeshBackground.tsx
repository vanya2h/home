import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

import { useIsDark } from "@/hooks/useIsDark";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BACKGROUND_SLUGS, gradientForSlug } from "@/lib/gradient";
import { cn } from "@/lib/utils";

/** Mirrors Tailwind's `md` breakpoint (48rem), so the shader flips where the layout does. */
const BELOW_MD = "(max-width: 47.999rem)";

/**
 * Fades the shader out over the first quarter viewport of scroll, and reports when it has gone
 * fully transparent so the caller can stop the shader entirely.
 *
 * The opacity itself is written straight to the node rather than held in state — it changes every
 * frame while scrolling through the fade band, and React has no business re-rendering for that.
 * Only the on/off flag is state, and that flips twice per visit to the top of the page.
 */
function useScrollFadeOut() {
  const ref = useRef<HTMLDivElement>(null);
  const [isFadedOut, setIsFadedOut] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lastOpacity = -1;
    // Only changes on resize, so it's cached here instead of re-read (and re-laid-out) per frame.
    let distance = window.innerHeight;

    const apply = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      // Fully transparent once a single viewport height has been scrolled.
      const progress = distance > 0 ? Math.min((window.scrollY * 4) / distance, 1) : 1;
      const opacity = 1 - progress;
      // Past the fade band every scroll frame computes the same 0 — don't dirty style for it.
      if (opacity === lastOpacity) return;
      lastOpacity = opacity;
      node.style.opacity = String(opacity);
      setIsFadedOut(opacity === 0);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    const onResize = () => {
      distance = window.innerHeight;
      schedule();
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { ref, isFadedOut };
}

function useCyclingPreset(isDark: boolean) {
  const [cursor, setCursor] = useState({ dark: 0, light: 0 });
  const settled = useRef(false);

  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    const theme = isDark ? "dark" : "light";
    setCursor((prev) => ({ ...prev, [theme]: prev[theme] + 1 }));
  }, [isDark]);

  const slugs = isDark ? BACKGROUND_SLUGS.dark : BACKGROUND_SLUGS.light;
  const slug = slugs[cursor[isDark ? "dark" : "light"] % slugs.length] as string;

  return gradientForSlug(slug);
}

export function MeshBackground({ className }: { className?: string }) {
  const { ref, isFadedOut } = useScrollFadeOut();
  const isDark = useIsDark();
  const preset = useCyclingPreset(isDark);
  const isBelowMd = useMediaQuery(BELOW_MD);

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0", className)}
      style={{
        // Hidden rather than merely transparent: a transparent full-viewport canvas still costs a
        // composite on every scrolled frame.
        visibility: isFadedOut ? "hidden" : "visible",
        // Keeps the per-frame opacity writes on the compositor while the fade is actually running.
        willChange: isFadedOut ? "auto" : "opacity",
      }}
      aria-hidden
    >
      {/* <MeshGradient
        className="h-full w-full animate-[fadeIn_1s_ease-in-out_forwards]"
        colors={["#271B42", "#612089", "#8243AC"]}
        distortion={1}
        swirl={0.8}
        grainMixer={1}
        grainOverlay={0.16}
        speed={0.3}
        scale={0.68}
        rotation={152}
      /> */}
      <GrainGradient
        style={{ width: "100%", height: "100%", opacity: "var(--mesh-opacity)" }}
        shape="sphere"
        colors={preset.colors}
        rotation={140}
        colorBack="#00000000"
        softness={1}
        intensity={isDark ? 0.5 : 0.3}
        noise={isDark ? 0.2 : 0}
        scale={isBelowMd ? 1.667 : 1.3333}
        fit="contain"
        // A non-zero speed keeps the shader's requestAnimationFrame loop alive for as long as it is
        // mounted, whatever its opacity. Zeroing it while scrolled past the fade cancels the loop,
        // so the rest of the page scrolls without a full-viewport WebGL redraw every frame.
        speed={isFadedOut ? 0 : 0.5}
      />
    </div>
  );
}
