import { createRequestHandler } from "@react-router/express";
import express from "express";
import z from "zod";
import "react-router";

const NodeEnv = z.enum(["development", "production"]);

declare module "react-router" {
  interface AppLoadContext {
    nodeEnv: z.output<typeof NodeEnv>;
    siteUrl: string;
  }
}

export function createApp(siteUrl: string) {
  const app = express();

  app.get("/favicon.ico", (_req, res) => {
    res.redirect(301, "/favicon.png");
  });

  app.use(
    createRequestHandler({
      build: () => import("virtual:react-router/server-build"),
      getLoadContext: () => ({
        nodeEnv: NodeEnv.parse(process.env.NODE_ENV),
        siteUrl,
      }),
    }),
  );

  return app;
}
