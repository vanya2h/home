import { MeshGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

/** Shared animated mesh-gradient page background, reused on the home and blog pages. */
export function MeshBackground({ className }: { className?: string }) {
  return (
    <MeshGradient
      className={cn("fixed inset-0 -z-10 h-full w-full animate-[fadeIn_1s_ease-in-out_forwards]", className)}
      colors={["#271B42", "#612089", "#8243AC"]}
      distortion={1}
      swirl={0.8}
      grainMixer={1}
      grainOverlay={0.16}
      speed={0.3}
      scale={0.68}
      rotation={152}
    />
  );
}
