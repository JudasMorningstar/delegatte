import { createAuthClient } from "better-auth/react";
import type { InferSessionFromClient } from "better-auth/client";

export function createSharedAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL,
  });
}

export type AuthClient = ReturnType<typeof createSharedAuthClient>;
export type Session = InferSessionFromClient<AuthClient>;

// Export auth client type for app-specific implementations
export { createAuthClient } from "better-auth/react";
