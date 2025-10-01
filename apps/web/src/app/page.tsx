"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@delegatte/ui/components/button";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = authClient.useSession();

  const user = session?.user;
  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Apps/Web</h1>
            <p className="text-center">You are logged in! {user?.name}</p>
            <Button onClick={() => authClient.signOut()}>Logout</Button>
          </div>
        </div>
      </Authenticated>
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        {" "}
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center">You are logged out</p>
            <Button asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
