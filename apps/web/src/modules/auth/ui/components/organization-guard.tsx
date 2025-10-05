"use client";

import { useActiveOrganization, useSession } from "@/lib/auth-client";
import { AuthLayout } from "../layouts/auth-layout";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, isPending: sessionPending } = useSession();
  const {
    data: activeOrganization,
    error,
    isPending: orgPending,
  } = useActiveOrganization();

  // Combined loading state
  const isLoading = sessionPending || orgPending;

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      redirect("/sign-in");
    }
  }, [session, isLoading]);

  // Check if user has any organizations
  useEffect(() => {
    if (!isLoading && session && !activeOrganization) {
      redirect("/onboarding");
    }
  }, [activeOrganization, session, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <AuthLayout isAuth={true}>
        <LoadingState
          title="Loading Workspace..."
          description="Please wait while we fetch your workspace!"
        />
      </AuthLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AuthLayout isAuth={true}>
        <ErrorState
          title="Error Loading Workspace"
          description="There was an error loading your workspace. Please try again later."
        />
      </AuthLayout>
    );
  }

  // No active organization (shouldn't reach here due to useEffect redirect)
  if (!activeOrganization) {
    return (
      <AuthLayout isAuth={true}>
        <ErrorState
          title="No Active Workspace"
          description="You don't have an active workspace. Redirecting..."
        />
      </AuthLayout>
    );
  }

  // Verify user is actually a member of the active organization
  const isMember = activeOrganization.members?.some(
    (member) => member.userId === session?.user?.id
  );

  if (!isMember) {
    return (
      <AuthLayout isAuth={true}>
        <ErrorState
          title="Access Denied"
          description="You are not a member of this workspace. Please contact an administrator."
        />
      </AuthLayout>
    );
  }

  // All checks passed
  return <>{children}</>;
};
