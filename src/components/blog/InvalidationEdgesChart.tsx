import { Area } from "@/components/dither-kit/area";
import { AreaChart } from "@/components/dither-kit/area-chart";
import { BlockLegend } from "@/components/dither-kit/block-legend";
import type { ChartConfig } from "@/components/dither-kit/chart-context";
import { Grid } from "@/components/dither-kit/grid";
import { Tooltip } from "@/components/dither-kit/tooltip";
import { XAxis } from "@/components/dither-kit/x-axis";
import { YAxis } from "@/components/dither-kit/y-axis";

/**
 * Option A — the size of the invalidation graph.
 *
 * K = cache keys holding a copy of entity T (one per view: list, filtered list,
 *     detail page, sidebar count, search result).
 * W = writes on T (create/update/delete, plus publish/archive/reorder, plus any
 *     write on a related entity that changes T).
 * E = W x K = invalidation edges: (write, cache key) pairs a developer wires by
 *     hand and has to keep in memory.
 *
 * W grows with the app here (W = K / 2), which is the quadratic case: every new
 * view must be reconciled against every write, and every new write against every
 * key.
 */
const KMAX = 16;

const data = Array.from({ length: KMAX + 1 }, (_, keys) => ({
  keys,
  growing: Math.round((keys / 2) * keys),
}));

const config: ChartConfig = {
  growing: { label: "writes grow with views (W = K/2)", color: "red" },
};

export function InvalidationEdgesChart() {
  return (
    <figure className="not-prose my-8 w-full rounded-2xl border border-white/10 bg-black/70 p-6 shadow-lg sm:p-8">
      <figcaption className="mb-1 text-lg font-semibold tracking-tight text-white">
        How many invalidation edges you maintain
      </figcaption>
      <p className="mb-4 text-sm text-white/50">
        An edge is one <em>(write, cache key)</em> pair: a place where a mutation has to remember to invalidate a cache
        that holds the same entity. Miss one and a view goes stale.
      </p>

      <BlockLegend config={config} className="mb-4" />

      <AreaChart data={data} config={config} animate={false} bloom="off" className="h-[320px] w-full sm:h-[380px]">
        <Grid />
        <YAxis tickCount={5} />
        <XAxis dataKey="keys" maxTicks={9} />
        <Area dataKey="growing" variant="gradient" strokeVariant="solid" />
        <Tooltip labelKey="keys" valueFormatter={(v) => `${v} edges`} />
      </AreaChart>

      <p className="mt-4 text-center text-xs uppercase tracking-wider text-white/40">
        cache keys holding the same entity →
      </p>
    </figure>
  );
}
