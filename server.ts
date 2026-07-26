import compression from "compression";
import express from "express";
import morgan from "morgan";

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000");
if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT "${process.env.PORT}" — must be a number.`);
}

function resolveSiteUrl(): string {
  if (DEVELOPMENT) return `http://localhost:${PORT}`;
  const url = process.env.VITE_SITE_URL;
  if (!url) {
    throw new Error("VITE_SITE_URL is required in production (e.g. https://vanya2h.me) — refusing to start.");
  }
  return url.replace(/\/+$/, "");
}

const SITE_URL = resolveSiteUrl();

const app = express();

app.use(compression());
app.disable("x-powered-by");

app.use(
  express.static("build/client", {
    maxAge: DEVELOPMENT ? 0 : "1h",
  }),
);

app.use(
  "/assets",
  express.static("build/client/assets", {
    immutable: true,
    maxAge: "1y",
  }),
);

if (DEVELOPMENT) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );

  app.use(viteDevServer.middlewares);
  // Rebuild the handler only when Vite hot-reloads the module (a new `source`
  // object), not on every request.
  let cachedSource: unknown;
  let cachedApp: express.Express;
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      if (source !== cachedSource) {
        cachedSource = source;
        cachedApp = source.createApp(SITE_URL);
      }
      return await cachedApp(req, res, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log("Starting production server");

  app.use(morgan("tiny"));
  app.use(await import(BUILD_PATH).then((mod) => mod.createApp(SITE_URL)));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
