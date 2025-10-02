"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useActiveOrganization } from "@/lib/auth-client";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { redirect, useRouter } from "next/navigation";

export default function StudioPage() {
  const {
    data: activeOrganization,
    error,
    isPending,
    isRefetching,
  } = useActiveOrganization();
  if (!activeOrganization) {
    return (
      <AuthLayout isAuth={true}>
        <ErrorState
          title="No Active Workspace Found"
          description="You do not belong to any active workspace. Please contact support or create a new workspace."
        />
      </AuthLayout>
    );
  }
  if (isPending && isRefetching) {
    return (
      <AuthLayout isAuth={true}>
        <LoadingState
          title="Loading..."
          description="Please wait while we fetch your workspace!"
        />
      </AuthLayout>
    );
  }
  if (activeOrganization) {
    redirect(`${activeOrganization.slug}/projects`);
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
