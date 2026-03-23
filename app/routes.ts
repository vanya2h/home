import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.tsx", [index("routes/home/index.tsx"), route("cv", "routes/cv.tsx")]),
  route("cv.pdf", "routes/cv-pdf.tsx"),
] satisfies RouteConfig;
