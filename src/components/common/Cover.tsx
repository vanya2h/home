import { GrainGradient } from "@paper-design/shaders-react";

import { gradientForSlug } from "@/lib/gradient";
import { cn } from "@/lib/utils";

export type CoverProps = React.ComponentProps<"div"> & {
  slug: string;
};

export function Cover({ slug, className, children, ...restProps }: CoverProps) {
  const preset = gradientForSlug(slug);

  return (
    <div className={cn("relative overflow-hidden", className)} {...restProps}>
      <div className="absolute inset-0">
        <GrainGradient
          style={{ width: "100%", height: "100%" }}
          shape={preset.shape}
          colors={preset.colors}
          rotation={preset.rotation}
          colorBack={preset.colorBack}
          softness={0.3}
          intensity={0.6}
          noise={0}
          scale={1.5}
          speed={1}
        />
      </div>
      {children ? (
        <>
          {/* Scrim so overlaid text stays legible over any gradient. */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center md:p-8">
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}
