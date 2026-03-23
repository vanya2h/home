import { createRequestHandler } from "@react-router/express";
import express from "express";
import z from "zod";
import "react-router";

const NodeEnv = z.enum(["development", "production"]);

declare module "react-router" {
  interface AppLoadContext {
    NODE_ENV: z.output<typeof NodeEnv>;
  }
}

export const app = express();

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext: (s) => ({
      NODE_ENV: NodeEnv.parse(process.env.NODE_ENV),
    }),
  }),
);
