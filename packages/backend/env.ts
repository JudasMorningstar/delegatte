import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function convexEnv() {
  return createEnv({
    server: {
      NODE_ENV: z.enum(["development", "production"]).optional(),
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
      CONVEX_URL: z.string().min(1),
      CONVEX_SELF_HOSTED_URL: z.string().min(1),
      CONVEX_SELF_HOSTED_ADMIN_KEY: z.string().min(1),
      SITE_URL: z.string().min(1),
    },
    client: {
      NEXT_PUBLIC_CONVEX_SITE_URL: z.string().min(1),
      NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
    },
    experimental__runtimeEnv: {
      NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
