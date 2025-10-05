"use client";

import * as React from "react";
import {
  SidebarHeader,
  SidebarContent,
  Sidebar,
  SidebarFooter,
} from "@delegatte/ui/components/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";
import { useListOrganizations } from "@/lib/auth-client";
import {
  generateDashboardNavItems,
  generateSecondaryItems,
} from "@/lib/constants";
import { NavSecondary } from "./nav-secondary";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  slug: string;
}

export function AppSidebar({ slug, ...props }: AppSidebarProps) {
  const generatedNavItems = React.useMemo(
    () => generateDashboardNavItems(slug),
    [slug]
  );

  const generatedSecondaryItems = React.useMemo(
    () => generateSecondaryItems(slug),
    [slug]
  );

  const { data: organizations, isPending, error } = useListOrganizations();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="mb-4  text-sm font-medium">
          {isPending ? (
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          ) : error ? (
            <div className="text-destructive text-sm">
              Failed to load organizations
            </div>
          ) : organizations && organizations.length > 0 ? (
            <WorkspaceSwitcher organizations={organizations} />
          ) : (
            <div className="text-muted-foreground text-sm">
              No organizations yet
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={generatedNavItems} />
        <NavSecondary items={generatedSecondaryItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
