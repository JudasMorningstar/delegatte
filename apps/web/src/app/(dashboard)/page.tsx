"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudioPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  // Handle session redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/sign-in");
    }
  }, [session, isSessionLoading]);

  // Handle session loading state
  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState
          title="Checking authentication..."
          description="Please wait"
        />
      </div>
    );
  }

  // Show loading while redirecting (don't render the rest if no session)
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState title="Redirecting..." description="Please wait" />
      </div>
    );
  }

  return null;
}
