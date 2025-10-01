import { useState } from "react";

import { Icons } from "@/components/icons";
import { authClient } from "@/lib/auth-client";
import { Button } from "@delegatte/ui/components/button";
import { toast } from "@delegatte/ui/components/toast";

interface OAuthSignInButtonProps {
  provider: "apple" | "github" | "google";
  icon?: keyof typeof Icons;
}

export default function OAuthSignInButton({
  provider,
  icon,
}: OAuthSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const Icon = icon ? Icons[icon] : Icons.discord;
  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await authClient.signIn.social({
            provider,
            callbackURL: "/",
            newUserCallbackURL: "/setup-organization",
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error && error.message.includes("network")
              ? "Network error. Please check your connection and try again."
              : "Failed to sign in. Please try again.";

          toast.error("Sign in Error", {
            description: errorMessage,
          });
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      <Icon className="mr-2 h-4 w-4" />{" "}
      <span className="capitalize">Login with {provider}</span>
    </Button>
  );
}
