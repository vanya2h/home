import { BlogPanel } from "@/components/blog/BlogPanel";

/**
 * W x K shown directly, as a surface rather than a curve.
 *
 * A line chart has one x-axis, so drawing E = W x K as a curve forces an
 * assumption about how W moves while K grows. A matrix needs no such assumption:
 * every cell is the product itself, and the reader finds their own app on the
 * grid instead of being asked to accept the shape of a fitted line.
 */
const KS = [1, 2, 3, 4, 6, 8, 10, 12];
const WS = [1, 2, 3, 4, 6, 8, 10, 12];
const MAX = 144; // KS and WS both top out at 12

/** Colour ramps with the product; the exponent keeps the low end legible. */
function cellStyle(value: number) {
  const t = (value / MAX) ** 0.55;
  return {
    backgroundColor: `rgba(240, 70, 70, ${(0.04 + 0.72 * t).toFixed(3)})`,
    color: `rgba(255, 255, 255, ${(0.45 + 0.5 * t).toFixed(3)})`,
  };
}

export function InvalidationMatrix() {
  return (
    <BlogPanel as="figure" className="my-8 w-full">
      <figcaption className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        How many invalidation edges you maintain
      </figcaption>
      <p className="mt-2 mb-6 text-sm text-foreground/60">
        An edge is one <em>(write, cache key)</em> pair: a place where a mutation has to remember to invalidate a cache
        that holds the same entity. Miss one and a view goes stale.
      </p>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[19rem] border-separate border-spacing-0.5 text-center font-mono text-[11px] tabular-nums sm:border-spacing-1 sm:text-xs">
          <caption className="sr-only">
            Invalidation edges for each combination of writes on an entity and cache keys holding it
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-10 p-1 font-normal text-[10px] leading-tight text-foreground/40">
                <span className="block text-left">W ↓</span>
                <span className="block text-right">K →</span>
              </th>
              {KS.map((k) => (
                <th key={k} scope="col" className="p-1 font-normal text-foreground/40">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WS.map((w) => (
              <tr key={w}>
                <th scope="row" className="p-1 font-normal text-foreground/40">
                  {w}
                </th>
                {KS.map((k) => (
                  <td key={k} className="rounded-[3px] px-1 py-1.5" style={cellStyle(w * k)}>
                    {w * k}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-xs uppercase tracking-wider text-foreground/40">
        <span>↓ writes on the entity</span>
        <span>cache keys holding it →</span>
      </div>

      <figcaption className="mt-8 border-t border-foreground/20 pt-6 text-xs leading-relaxed text-foreground/50">
        Every cell is <strong className="text-foreground/60">W × K</strong> and nothing else — no fitted curve, no
        assumption about how one grows with the other. Find your own app on the grid: eight views of an entity with six
        writes on it is 48 relationships to wire by hand and keep in your head.
      </figcaption>
    </BlogPanel>
  );
}
