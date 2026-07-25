import type { GrainGradientProps } from "@paper-design/shaders-react";

export type GradientCover = {
  shape: GrainGradientProps["shape"];
  colors: string[];
  rotation: number;
  colorBack: string;
};

// Deterministic covers: the same slug always produces the same gradient.
// Adapted from the dashboard's generateGradient(), but Math.random() is
// replaced by a slug-seeded PRNG so output is stable across renders/SSR.

const SCHEMES = {
  analogous: [0, 30, -30, 60],
  complementary: [0, 180, 30, 210],
  triadic: [0, 120, 240, 60],
  splitComplementary: [0, 150, 210, 30],
  tetradic: [0, 90, 180, 270],
} as const satisfies Record<string, readonly number[]>;

// xmur3 string hash → 32-bit seed
function xmur3(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

// mulberry32 PRNG — deterministic sequence from a numeric seed
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n);
const hsl = (h: number, s: number, l: number) => `hsl(${round(((h % 360) + 360) % 360)}, ${round(s)}%, ${round(l)}%)`;

export function gradientForSlug(slug: string): GradientCover {
  const random = mulberry32(xmur3(slug));
  const rand = (min: number, max: number) => min + random() * (max - min);
  const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
  const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)] as T;

  const count = randInt(2, 4);
  const baseHue = rand(0, 360);
  const scheme = pick(Object.keys(SCHEMES) as (keyof typeof SCHEMES)[]);
  const offsets = SCHEMES[scheme].slice(0, count);
  const saturation = rand(72, 92);
  const lightness = rand(50, 62);
  const colors = offsets.map((offset) => hsl(baseHue + offset, saturation + rand(-8, 8), lightness + rand(-6, 6)));

  // Keep the backdrop dark so covers read on the site's dark surface.
  const baseColorHue = Number(colors[0]!.match(/hsl\((\d+)/)?.[1] ?? 0);
  const colorBack = hsl(baseColorHue, rand(18, 38), rand(4, 10));

  return {
    shape: "corners",
    rotation: randInt(0, 360),
    colorBack,
    colors,
  };
}
