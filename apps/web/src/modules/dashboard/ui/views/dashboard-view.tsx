"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useActiveOrganization, useListOrganizations } from "@/lib/auth-client";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { redirect } from "next/navigation";

export const DashboardView = () => {
  const {
    data: activeOrganization,
    error,
    isPending,
  } = useActiveOrganization();

  const { data: organizations } = useListOrganizations();

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

  if (organizations && organizations.length === 0) {
    redirect("/onboarding");
  }

  if (organizations && organizations.length > 0 && !activeOrganization) {
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
          buttonText="Go to Workspace Selection"
          onButtonClick={() => redirect("/workspace-selection")}
        />
      </AuthLayout>
    );
  }

  return null;
};
