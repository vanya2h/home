import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.tsx", [index("routes/home/index.tsx")]),
  route("cv.pdf", "routes/cv-pdf.tsx"),
  route("cover-letter-gnosis-pay.pdf", "routes/cover-letter-gnosis-pay-pdf.tsx"),
  route("cover-letter-speechify.pdf", "routes/cover-letter-speechify-pdf.tsx"),
  route("cover-letter-onramper.pdf", "routes/cover-letter-onramper-pdf.tsx"),
] satisfies RouteConfig;
