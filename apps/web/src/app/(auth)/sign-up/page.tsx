import React from "react";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { SignupForm } from "@/modules/auth/ui/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
