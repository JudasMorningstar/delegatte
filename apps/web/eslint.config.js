import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@delegatte/eslint-config/base";
import { nextjsConfig } from "@delegatte/eslint-config/nextjs";
import { reactConfig } from "@delegatte/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess
);
