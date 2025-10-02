"use client";

import { authClient } from "@/lib/auth-client";
import React from "react";

export default function ProjectsPage() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  return (
    <div>{activeOrganization ? <p>{activeOrganization.name}</p> : null}</div>
  );
}
