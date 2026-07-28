import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useId, useRef } from "react";

import { gradientForSlug } from "@/lib/gradient";
import { cn } from "@/lib/utils";

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

export function MeshBackground({ className }: { className?: string }) {
  const ref = useScrollFadeOut();
  const id = useId();
  const preset = gradientForSlug(id);

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
        style={{ width: "100%", height: "100%", opacity: 0.3 }}
        shape="sphere"
        colors={preset.colors}
        rotation={140}
        colorBack="#00000000"
        softness={0.6}
        intensity={0.5}
        noise={0.2}
        scale={1.3333}
        speed={2}
      />
    </div>
  );
}
