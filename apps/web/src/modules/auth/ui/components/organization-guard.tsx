"use client";

import {
  useActiveOrganization,
  useListOrganizations,
  useSession,
} from "@/lib/auth-client";
import { AuthLayout } from "../layouts/auth-layout";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface OrganizationGuardProps {
  slug: string;
  children: React.ReactNode;
}

export const OrganizationGuard = ({
  children,
  slug,
}: OrganizationGuardProps) => {
  const { data: session, isPending: sessionPending } = useSession();
  const {
    data: activeOrganization,
    error,
    isPending: orgPending,
  } = useActiveOrganization();

  const { data: organizations, isPending: orgListPending } =
    useListOrganizations();

  // Combined loading state
  const isLoading = sessionPending || orgPending || orgListPending;

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      redirect("/sign-in");
    }
  }, [session, isLoading]);

  // Check if user has any organizations
  useEffect(() => {
    if (
      !isLoading &&
      session &&
      (!organizations || organizations.length === 0)
    ) {
      redirect("/onboarding");
    }
  }, [organizations, session, isLoading]);

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

  // No active organization
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

  // Check if user is a member of the organization specified by slug
  const isMember = organizations?.some((org) => org.slug === slug);

  if (!isMember && isLoading === false) {
    return (
      <AuthLayout isAuth={true}>
        <ErrorState
          title="Access Denied"
          description="You don't have access to this workspace. Please contact an administrator or switch to a workspace you're a member of."
          buttonText="Go to Workspace Selection"
          onButtonClick={() => redirect("/workspace-selection")}
        />
      </AuthLayout>
    );
  }

  return <>{children}</>;
};
