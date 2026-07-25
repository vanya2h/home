import { useEffect, useId, useState } from "react";

/**
 * Client-side mermaid renderer. Mermaid is imported dynamically inside the
 * effect so it never loads on the server (it touches `document` at import),
 * which keeps this component SSR-safe — the diagram paints after hydration.
 */
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const [svg, setSvg] = useState("");
  const id = `mmd${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        themeVariables: {
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
  }, [chart, id]);

  return (
    <figure className="not-prose my-8">
      <div
        className="overflow-x-auto rounded-2xl border border-white/10 bg-black/70 p-4 sm:p-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption ? <figcaption className="mt-3 text-center text-xs text-white/50">{caption}</figcaption> : null}
    </figure>
  );
}
