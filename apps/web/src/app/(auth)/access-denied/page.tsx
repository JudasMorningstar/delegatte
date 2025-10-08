"use client";
import { ErrorState } from "@/components/error-state";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { redirect } from "next/navigation";
import React from "react";

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <AuthLayout isAuth={true}>
        <ErrorState
          title="Access Denied"
          description="You are not a member of this workspace. Please contact an administrator."
          buttonText="Go to My Workspaces"
          onButtonClick={() => redirect("/workspace-selection")}
        />
      </AuthLayout>
    </div>
  );
}
