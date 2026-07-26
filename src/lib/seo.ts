function resolveSiteUrl(): string {
  const override = import.meta.env.VITE_SITE_URL;
  if (override) return override.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://vanya2h.me";
}

export function siteUrlFromMatches(
  matches: ReadonlyArray<{ id: string; data?: unknown } | undefined>,
): string | undefined {
  const data = matches.find((m) => m?.id === "root")?.data;
  if (data && typeof data === "object" && "siteUrl" in data) {
    const siteUrl = (data as { siteUrl?: unknown }).siteUrl;
    if (typeof siteUrl === "string") return siteUrl;
  }
  return undefined;
}

const BUILD_VERSION = typeof __CV_BUILD_VERSION__ !== "undefined" ? __CV_BUILD_VERSION__ : "dev";

function ogImageUrl({
  siteUrl,
  title,
  description,
  seed,
}: {
  siteUrl: string;
  title: string;
  description: string;
  seed?: string;
}): string {
  const params = new URLSearchParams({ title, description, v: BUILD_VERSION });
  if (seed) params.set("seed", seed);
  return `${siteUrl}/og?${params.toString()}`;
}

interface SeoInput {
  siteUrl?: string;
  title: string;
  description: string;
  /** Pathname (e.g. "/blog/my-post"). Used for og:url and canonical. */
  path?: string;
  image?: string;
  ogImage?: boolean;
  /** Seeds the generative OG gradient (e.g. a post slug) for a stable look. */
  seed?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article";
}

// Static site-wide social image (square) vs. the generative /og card (landscape).
const DEFAULT_IMAGE = { path: "/asterisk.png", width: 1024, height: 1024 } as const;
const OG_IMAGE = { width: 1200, height: 630 } as const;

export function buildMeta({
  siteUrl = resolveSiteUrl(),
  title,
  description,
  path = "/",
  image,
  ogImage = false,
  seed,
  imageWidth,
  imageHeight,
  type = "website",
}: SeoInput) {
  const url = `${siteUrl}${path}`;

  // Explicit image wins; otherwise blog-style pages opt into the generative
  // card and everything else falls back to the static site image.
  const resolvedImage =
    image ?? (ogImage ? ogImageUrl({ siteUrl, title, description, seed: seed ?? path }) : DEFAULT_IMAGE.path);
  const absoluteImage = resolvedImage.startsWith("http") ? resolvedImage : `${siteUrl}${resolvedImage}`;

  const usesDefaultImage = !image && !ogImage;
  const width = imageWidth ?? (usesDefaultImage ? DEFAULT_IMAGE.width : OG_IMAGE.width);
  const height = imageHeight ?? (usesDefaultImage ? DEFAULT_IMAGE.height : OG_IMAGE.height);

  return [
    { title },
    { name: "description", content: description },

    // Open Graph
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: absoluteImage },
    { property: "og:image:width", content: String(width) },
    { property: "og:image:height", content: String(height) },
    { property: "og:url", content: url },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteImage },

    { tagName: "link", rel: "canonical", href: url },
  ];
}
