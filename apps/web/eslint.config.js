import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@delegatte/eslint-config/base";
import { reactConfig } from "@delegatte/eslint-config/react";
import { nextjsConfig } from "@delegatte/eslint-config/nextjs";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess
);
