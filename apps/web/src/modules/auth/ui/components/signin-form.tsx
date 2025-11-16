"use client";

import { Button } from "@delegatte/ui/components/button";
import { Input } from "@delegatte/ui/components/input";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSeparator,
  FieldGroup,
} from "@delegatte/ui/components/field";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@delegatte/ui/components/alert";
import { cn } from "@delegatte/ui/lib/utils";
import { GalleryVerticalEnd, Mail, AlertCircle, Icon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Icons } from "@/components/icons";
import OAuthSignInButton from "./oauth-button";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Delegatte</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Delegatte</h1>
          </div>

          {alert ? (
            <Field>
              <Alert
                variant={alert.type === "error" ? "destructive" : "default"}
              >
                {alert.type === "success" ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {alert.type === "success" ? "Check your email" : "Error"}
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
              {alert.type === "error" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setAlert(null)}
                >
                  Try Again
                </Button>
              )}
            </Field>
          ) : (
            <>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={magicLinkLoading}
                  onClick={async (e) => {
                    e.preventDefault();
                    setAlert(null);

                    if (!email) {
                      setAlert({
                        type: "error",
                        message: "Please enter your email address",
                      });
                      return;
                    }

                    try {
                      await authClient.signIn.magicLink(
                        {
                          email,
                          callbackURL: "/workspace-selection",
                          newUserCallbackURL: "/onboarding",
                          errorCallbackURL: "/error",
                        },

                        {
                          onRequest: () => {
                            setMagicLinkLoading(true);
                          },
                          onSuccess: () => {
                            setMagicLinkLoading(false);
                            setAlert({
                              type: "success",
                              message: `We've sent a magic link to ${email}. Click the link in your email to sign in.`,
                            });
                          },
                          onError: (ctx) => {
                            setMagicLinkLoading(false);
                            setAlert({
                              type: "error",
                              message:
                                ctx.error.message ||
                                "Failed to send magic link. Please try again.",
                            });
                          },
                        }
                      );
                    } catch (error) {
                      setMagicLinkLoading(false);
                      setAlert({
                        type: "error",
                        message:
                          error instanceof Error
                            ? error.message
                            : "An unexpected error occurred",
                      });
                    }
                  }}
                >
                  {magicLinkLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field className="flex flex-col gap-4">
                <OAuthSignInButton provider="google" icon="google" />
                <OAuthSignInButton provider="github" icon="gitHub" />
              </Field>
            </>
          )}
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
