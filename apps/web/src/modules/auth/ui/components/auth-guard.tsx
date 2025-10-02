"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import { SignInView } from "../views/sign-in-view";
import { AuthLayout } from "../layouts/auth-layout";
import { LoadingState } from "@/components/loading-state";
import { f } from "node_modules/better-auth/dist/shared/better-auth.DFpuqBlM";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Authenticated>
        <AuthLayout isAuth={false}>{children}</AuthLayout>
      </Authenticated>
      <AuthLoading>
        <AuthLayout isAuth={true}>
          <LoadingState
            title="Checking authentication..."
            description="Please wait"
          />
        </AuthLayout>
      </AuthLoading>
      <Unauthenticated>
        <AuthLayout isAuth={true}>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
