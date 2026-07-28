import { GridPattern } from "@/components/common/GridPattern";
import { MeshBackground } from "@/components/common/MeshBackground";

/**
 * Global page background, mounted once in the root layout as a direct child of <body>.
 *
 * Layers, bottom to top: a solid dark base pinned to the viewport, a grid that spans the
 * full document height (so it scrolls with the page), and the mesh gradient that fades out
 * over the first viewport height of scroll to reveal the grid and keep content readable.
 *
 * The grid layer is absolutely positioned, so it needs a positioned ancestor with the
 * document's height to stretch against — `body { position: relative }` in app.css.
 */
export function PageBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-30 bg-zinc-950" aria-hidden />
      <GridPattern width={22} height={22} className="-z-20 fill-white/2 stroke-white/6" />
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <MeshBackground />
      </div>
    </>
  );
}
