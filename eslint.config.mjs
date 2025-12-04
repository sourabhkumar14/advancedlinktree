// eslint.config.mjs

import eslint from "eslint";
import next from "eslint-config-next";

const { FlatCompat } = eslint;

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...next,
];
