"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@delegatte/ui/components/button";
import { Checkbox } from "@delegatte/ui/components/checkbox";
import { Input } from "@delegatte/ui/components/input";
import { Label } from "@delegatte/ui/components/label";
import { toast } from "@delegatte/ui/components/toast";

import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/modules/auth/ui/components/auth-card";
import OAuthSignInButton from "@/modules/auth/ui/components/oauth-button";
import { PasswordInput } from "@/modules/auth/ui/components/password-input";
import { Icons } from "@/components/icons";

export const SignInView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <AuthCard
      title="Welcome back"
      description="Login with your Google or GitHub account"
    >
      <div className="grid gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e: any) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/sign-in/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <PasswordInput
              id="password"
              required
              placeholder="********"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              className="w-full"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async (e) => {
              e.preventDefault();
              try {
                const result = await authClient.signIn.email(
                  { email, password, rememberMe, callbackURL: "/" },
                  {
                    onRequest: () => setLoading(true),
                    onResponse: () => setLoading(false),
                  }
                );
                if (result.data) {
                  redirect("/");
                }
              } catch (error) {
                toast.error("Sign-in failed", { description: String(error) });
              }
            }}
          >
            {loading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <p>Login</p>
            )}
          </Button>
        </div>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <OAuthSignInButton provider="google" icon="google" />
          <OAuthSignInButton provider="github" icon="gitHub" />
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};
