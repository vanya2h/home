import { config } from "@vanya2h/eslint-config/base";
import { Linter } from "eslint";

export default [
  ...config,
  {
    ignores: ["build/**", "node_modules/**", "types/**", ".react-router/**"],
  },
] satisfies Linter.Config[];
