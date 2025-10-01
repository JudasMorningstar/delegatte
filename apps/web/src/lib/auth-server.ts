import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@delegatte/backend/auth";

export const getToken = () => {
  return getTokenNextjs(createAuth);
};
