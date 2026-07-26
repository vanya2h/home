import { readFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import type { LoaderFunctionArgs } from "react-router";
import satori from "satori";

import { gradientForSlug } from "@/lib/gradient";

const WIDTH = 1200;
const HEIGHT = 630;

const FONT_FILES = {
  400: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-400-normal.woff",
  600: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-600-normal.woff",
  700: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-700-normal.woff",
} as const;

let fontsPromise: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 600 | 700; style: "normal" }[]> | undefined;

function loadFonts() {
  fontsPromise ??= Promise.all(
    (Object.entries(FONT_FILES) as [string, string][]).map(async ([weight, url]) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load OG font ${weight}: ${res.status}`);
      return {
        name: "Inter",
        data: await res.arrayBuffer(),
        weight: Number(weight) as 400 | 600 | 700,
        style: "normal" as const,
      };
    }),
  );
  return fontsPromise;
}

let markPromise: Promise<string | null> | undefined;

function loadMark() {
  markPromise ??= (async () => {
    for (const candidate of ["build/client/asterisk.png", "public/asterisk.png"]) {
      try {
        const bytes = await readFile(candidate);
        return `data:image/png;base64,${bytes.toString("base64")}`;
      } catch {
        // try the next location
      }
    }
    return null;
  })();
  return markPromise;
}

function truncate(value: string, max: number) {
  const trimmed = value.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = truncate(url.searchParams.get("title") || "Vanya2h", 90);
  const description = truncate(url.searchParams.get("description") || "", 160);
  // Deterministic gradient — same seed always yields the same cover, matching
  // the on-page <Cover /> so the social card echoes the article header.
  const seed = url.searchParams.get("seed") || title;
  const g = gradientForSlug(seed);
  const mark = await loadMark();

  const svg = await satori(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: g.colorBack,
        backgroundImage: `linear-gradient(${g.rotation}deg, ${g.colors.join(", ")})`,
        fontFamily: "Inter",
      }}
    >
      {/* Scrim: keeps white text legible over any gradient, darkest at the base. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          backgroundImage: "linear-gradient(160deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
          {mark ? <img src={mark} width={40} height={40} style={{ marginRight: 16 }} /> : null}
          vanya2h.me
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {title}
          </div>
          {description ? (
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT, fonts: await loadFonts() },
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();

  return new Response(png as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      // URL is versioned by `v`, so a given URL's bytes never change.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
