// eslint.config.mjs
import { defineConfig } from "eslint";
import next from "eslint-config-next";

export default defineConfig([
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...next,
]);
 