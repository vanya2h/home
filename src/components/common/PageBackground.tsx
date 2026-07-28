import { GridPattern } from "@/components/common/GridPattern";
import { MeshBackground } from "@/components/common/MeshBackground";

export function PageBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-30 bg-background" aria-hidden />
      <GridPattern width={22} height={22} className="-z-20 fill-grid-fill stroke-grid-line" />
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <MeshBackground />
      </div>
    </>
  );
}
