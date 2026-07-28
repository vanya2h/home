import type { BlobOrigin } from "@/components/common/FluidBlobs";
import { FluidBlobs } from "@/components/common/FluidBlobs";
import { gradientForSlug } from "@/lib/gradient";
import { cn } from "@/lib/utils";

export type CoverProps = React.ComponentProps<"div"> & {
  slug: string;
};

const ORIGINS: BlobOrigin[] = [
  { x: 24, y: 32 },
  { x: 76, y: 26 },
  { x: 62, y: 74 },
  { x: 22, y: 78 },
];

export function Cover({ slug, className, children, ...restProps }: CoverProps) {
  const preset = gradientForSlug(slug);

  return (
    <div className={cn("relative overflow-hidden", className)} {...restProps}>
      <FluidBlobs colors={preset.colors} origins={ORIGINS} margin={60} blur={100} />
      {children ? (
        <>
          <div className="absolute inset-0 bg-white/10 dark:bg-black/5 mix-blend-plus-lighter" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center md:p-8">
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}
