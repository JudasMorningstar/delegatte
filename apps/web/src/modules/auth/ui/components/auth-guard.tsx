"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import { SignInView } from "../views/sign-in-view";
import { AuthLayout } from "../layouts/auth-layout";
import { LoadingState } from "@/components/loading-state";
import { SigninForm } from "./signin-form";

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
          <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
              <SigninForm />
            </div>
          </div>
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
