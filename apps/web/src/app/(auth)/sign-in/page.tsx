import { SigninForm } from "@/modules/auth/ui/components/signin-form";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm />
      </div>
    </div>
  );
}
