import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

import { useIsDark } from "@/hooks/useIsDark";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BACKGROUND_SLUGS, gradientForSlug } from "@/lib/gradient";
import { cn } from "@/lib/utils";

/** Mirrors Tailwind's `md` breakpoint (48rem), so the shader flips where the layout does. */
const BELOW_MD = "(max-width: 47.999rem)";

function useScrollFadeOut() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const apply = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      // Fully transparent once a single viewport height has been scrolled.
      const distance = window.innerHeight;
      const progress = distance > 0 ? Math.min((window.scrollY * 4) / distance, 1) : 1;
      node.style.opacity = String(1 - progress);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return ref;
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
  const ref = useScrollFadeOut();
  const isDark = useIsDark();
  const preset = useCyclingPreset(isDark);
  const isBelowMd = useMediaQuery(BELOW_MD);

  return (
    <div ref={ref} className={cn("absolute inset-0", className)} aria-hidden>
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
        scale={isBelowMd ? 2 : 1.3333}
        fit="contain"
        speed={0.5}
      />
    </div>
  );
}
