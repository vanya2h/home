import { Area } from "@/components/dither-kit/area";
import { AreaChart } from "@/components/dither-kit/area-chart";
import type { ChartConfig } from "@/components/dither-kit/chart-context";
import { Grid } from "@/components/dither-kit/grid";
import { Legend } from "@/components/dither-kit/legend";
import { XAxis } from "@/components/dither-kit/x-axis";
import { YAxis } from "@/components/dither-kit/y-axis";

// cost of keeping every view in sync as the number of views grows: f(x) = e^x
const STEP = 0.25;
const NMAX = 30; // max number of views
const SKEW = 7; // larger = flat longer, sharper late takeoff
const data = Array.from({ length: NMAX / STEP + 1 }, (_, i) => {
  const views = i * STEP;
  return { views, reactQuery: Math.exp(views / SKEW) };
});
const maxCost = data[data.length - 1].reactQuery;

const config: ChartConfig = {
  reactQuery: { label: "invalidate per key (react-query)", color: "primary" },
};

export function NonLinearChart() {
  return (
    <figure className="not-prose my-8 w-full rounded-2xl border border-white/10 bg-black/70 p-6 shadow-lg sm:p-8">
      <figcaption className="mb-1 text-lg font-semibold tracking-tight text-white">
        Cost of keeping the app in sync
      </figcaption>
      <p className="mb-6 text-sm text-white/50">
        As the same entity is rendered in more views, invalidate-per-key work stays cheap for a while, then grows
        exponentially.
      </p>

      <AreaChart data={data} config={config} animate={false} bloom="off" className="h-[320px] w-full sm:h-[380px]">
        <Grid />
        <YAxis tickCount={5} tickFormatter={(v) => (v <= maxCost * 0.05 ? "low" : v >= maxCost * 0.95 ? "high" : "")} />
        <XAxis dataKey="views" maxTicks={data.length} tickFormatter={(v) => (Number(v) % 5 === 0 ? `${v}` : "")} />
        <Area dataKey="reactQuery" variant="gradient" strokeVariant="solid" />
        <Legend />
      </AreaChart>

      <p className="mt-4 text-center text-xs uppercase tracking-wider text-white/40">
        number of views rendering the same entity →
      </p>
    </figure>
  );
}
