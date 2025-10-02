"use client";

import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "../layouts/auth-layout";
import { ErrorState } from "@/components/error-state";

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: activeOrganization, error } =
    authClient.useActiveOrganization();
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

  return <>{children}</>;
};
