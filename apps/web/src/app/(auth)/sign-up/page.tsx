"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@delegatte/ui/components/button";
import { Input } from "@delegatte/ui/components/input";
import { Label } from "@delegatte/ui/components/label";
import { toast } from "@delegatte/ui/components/toast";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validatePasswords = () => {
    if (password !== passwordConfirmation) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AuthCard
      title="Create an account"
      description="Enter your information to get started"
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              placeholder="Max"
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              placeholder="Robinson"
              required
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            required
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            autoComplete="new-password"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <PasswordInput
            id="password_confirmation"
            required
            placeholder="********"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full"
            autoComplete="new-password"
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Profile Image (optional)</Label>
          <div className="flex items-end gap-4">
            {imagePreview && (
              <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex w-full items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {imagePreview && (
                <X
                  className="cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          onClick={async (e) => {
            if (!validatePasswords()) return;
            e.preventDefault();
            await authClient.signUp.email({
              email,
              password,
              name: `${firstName} ${lastName}`,
              image: image ? await convertImageToBase64(image) : "",
              callbackURL: "/onboarding",
              fetchOptions: {
                onResponse: () => setLoading(false),
                onRequest: () => setLoading(true),
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
                onSuccess: () => router.push("/onboarding"),
              },
            });
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Create an account"
          )}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
