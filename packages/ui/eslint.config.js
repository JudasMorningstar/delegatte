import { defineConfig } from "eslint/config";

import { baseConfig } from "@delegatte/eslint-config/base";
import { reactConfig } from "@delegatte/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig
);
