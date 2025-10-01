"use client";

import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { api } from "@delegatte/backend/_generated/api";

export default function Page() {
  const users = useQuery(api.user.getMany);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Apps/Web</h1>
        <Unauthenticated>Logged out</Unauthenticated>
        <Authenticated>Logged in</Authenticated>
        <AuthLoading>Loading...</AuthLoading>
        {users && <div>Users count: {users.length}</div>}
      </div>
    </div>
  );
}
