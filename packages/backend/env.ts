import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    CONVEX_URL: z.string().min(1),
    CONVEX_SELF_HOSTED_URL: z.string().min(1),
    CONVEX_SELF_HOSTED_ADMIN_KEY: z.string().min(1),
    SITE_URL: z.string().min(1),
    CONVEX_SITE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CONVEX_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CONVEX_URL: process.env.CONVEX_URL,
    CONVEX_SELF_HOSTED_URL: process.env.CONVEX_SELF_HOSTED_URL,
    CONVEX_SELF_HOSTED_ADMIN_KEY: process.env.CONVEX_SELF_HOSTED_ADMIN_KEY,
    SITE_URL: process.env.SITE_URL,
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
