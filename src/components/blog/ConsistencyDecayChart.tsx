import { Line } from "@/components/dither-kit/area";
import { LineChart } from "@/components/dither-kit/area-chart";
import { BlockLegend } from "@/components/dither-kit/block-legend";
import type { ChartConfig } from "@/components/dither-kit/chart-context";
import { Grid } from "@/components/dither-kit/grid";
import { ReferenceLine } from "@/components/dither-kit/reference-line";
import { Tooltip } from "@/components/dither-kit/tooltip";
import { XAxis } from "@/components/dither-kit/x-axis";
import { YAxis } from "@/components/dither-kit/y-axis";

/**
 * Option B — the odds that every view is showing current data.
 *
 * K = cache keys holding a copy of entity T, W = writes on T, so there are
 * E = W x K invalidation edges to wire by hand. Give each edge an independent
 * probability p of being missed, and the app is fully consistent only when every
 * edge survives:
 *
 *   P(no stale view anywhere) = (1 - p) ^ (W * K)
 *
 * The cost of the graph is quadratic; correctness decays exponentially in it,
 * because it is a product of per-edge survival odds. p is the one assumed
 * parameter, so it is shown as a family of curves rather than a chosen value.
 *
 * A normalized store has no edges at all (E = 0), so it sits at 100% for every
 * K — drawn as a reference line rather than a series, since a flat top-of-plot
 * series paints a glow slab over the curves.
 */
const KMAX = 12;
const WRITES = 6;

const survival = (p: number, keys: number) => (1 - p) ** (WRITES * keys) * 100;

const data = Array.from({ length: KMAX + 1 }, (_, keys) => ({
  keys,
  p1: survival(0.01, keys),
  p3: survival(0.03, keys),
  p6: survival(0.06, keys),
}));

const config: ChartConfig = {
  p1: { label: "1% chance of missing an edge", color: "blue" },
  p3: { label: "3% chance", color: "orange" },
  p6: { label: "6% chance", color: "red" },
};

export function ConsistencyDecayChart() {
  return (
    <figure className="not-prose my-8 w-full rounded-2xl border border-white/10 bg-black/70 p-6 shadow-lg sm:p-8">
      <figcaption className="mb-1 text-lg font-semibold tracking-tight text-white">
        Odds that every view is showing current data
      </figcaption>
      <p className="mb-4 text-sm text-white/50">
        Each cache key holding the entity adds invalidation edges to wire by hand. The app is correct only when every
        single edge is right, so the odds are a product — and products collapse.
      </p>

      <BlockLegend config={config} className="mb-4" />

      <LineChart
        data={data}
        config={config}
        animate={false}
        bloom="off"
        margins={{ top: 18 }}
        className="h-[320px] w-full sm:h-[380px]"
      >
        <Grid />
        <YAxis tickCount={5} tickFormatter={(v) => `${v}%`} />
        <XAxis dataKey="keys" maxTicks={13} />
        <Line dataKey="p1" strokeVariant="solid" />
        <Line dataKey="p3" strokeVariant="solid" />
        <Line dataKey="p6" strokeVariant="solid" />
        <ReferenceLine y={100} label="normalized store — no edges to miss" className="stroke-emerald-400/70" />
        <Tooltip labelKey="keys" valueFormatter={(v) => `${v.toFixed(1)}%`} />
      </LineChart>

      <p className="mt-4 text-center text-xs uppercase tracking-wider text-white/40">
        cache keys holding the same entity →
      </p>

      <figcaption className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/40">
        <strong className="text-white/60">Model, not measurement.</strong> Assumes {WRITES} writes on the entity, one
        cache key per view, and misses that are independent — real misses cluster, so the real curve falls faster. A
        normalized store has no edges to miss, so it stays pinned at 100%.
      </figcaption>
    </figure>
  );
}
