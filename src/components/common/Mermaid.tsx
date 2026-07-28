import { useEffect, useId, useState } from "react";

import { BlogPanel } from "@/components/blog/BlogPanel";
import { useIsDark } from "@/hooks/useIsDark";

/**
 * Mermaid bakes colours into the SVG at render time, so it can't read theme variables from
 * CSS the way the rest of the page does — each theme needs its own palette here, and the
 * diagram has to be re-rendered when the theme changes.
 */
const THEME_VARIABLES = {
  dark: {
    primaryColor: "#2a1e42",
    primaryBorderColor: "#8243AC",
    primaryTextColor: "#ffffff",
    lineColor: "#b794d6",
    actorBkg: "#2a1e42",
    actorBorder: "#8243AC",
    actorTextColor: "#ffffff",
    actorLineColor: "#6b558a",
    signalColor: "#c9b3e0",
    signalTextColor: "#e9dcf6",
    noteBkgColor: "#3a2a55",
    noteTextColor: "#ffffff",
    noteBorderColor: "#8243AC",
  },
  light: {
    primaryColor: "#f1e9fa",
    primaryBorderColor: "#7a3ba3",
    primaryTextColor: "#241633",
    lineColor: "#6b4a8a",
    actorBkg: "#f1e9fa",
    actorBorder: "#7a3ba3",
    actorTextColor: "#241633",
    actorLineColor: "#9b82b5",
    signalColor: "#5a4472",
    signalTextColor: "#2e1f42",
    noteBkgColor: "#e6dbf5",
    noteTextColor: "#241633",
    noteBorderColor: "#7a3ba3",
  },
} as const;

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const [svg, setSvg] = useState("");
  const id = `mmd${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const isDark = useIsDark();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "base",
        securityLevel: "strict",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        themeVariables: THEME_VARIABLES[isDark ? "dark" : "light"],
      });
      try {
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled) setSvg(svg);
      } catch {
        // Ignore parse/render errors — the diagram is decorative.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, isDark]);

  return (
    <BlogPanel as="figure" className="my-8">
      {/* Scrolls inside the panel's padding, so a wide diagram never widens the page. */}
      <div
        className="overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption ? <figcaption className="mt-4 text-center text-xs text-foreground/50">{caption}</figcaption> : null}
    </BlogPanel>
  );
}
