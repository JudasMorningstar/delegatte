import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { toast } from "@delegatte/ui/components/toast";
import { createAuthClient } from "better-auth/react";

export const authClient: any = createAuthClient({
  plugins: [convexClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
    onUnauthorized() {
      toast.error("You are not authorized. Please sign in.");
    },
  },
});

export const { signUp, signIn, signOut, useSession } = authClient;
