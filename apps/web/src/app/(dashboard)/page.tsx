"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useActiveOrganization } from "@/lib/auth-client";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { redirect } from "next/navigation";

export default function StudioPage() {
  const {
    data: activeOrganization,
    error,
    isPending,
  } = useActiveOrganization();

  if (isPending) {
    return (
      <AuthLayout isAuth={true}>
        <LoadingState
          title="Loading..."
          description="Please wait while we fetch your workspace!"
        />
      </AuthLayout>
    );
  }

  if (!activeOrganization) {
    redirect("/workspace-selection");
  }

  if (activeOrganization) {
    redirect(`/${activeOrganization.slug}/projects`);
  }

  if (error) {
    return (
      <AuthLayout isAuth={true}>
        <ErrorState
          title="Error Fetching Workspaces"
          description="There was an error fetching your workspaces. Please try again later."
        />
      </AuthLayout>
    );
  }

  return null;
}
