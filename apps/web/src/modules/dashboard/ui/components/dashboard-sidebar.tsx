"use client";

import * as React from "react";
import {
  SidebarHeader,
  SidebarContent,
  Sidebar,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@delegatte/ui/components/sidebar";

import { useListOrganizations } from "@/lib/auth-client";

import { WorkspaceSwitcher } from "@/modules/dashboard/ui/components/workspace-switcher";
import {
  generateDashboardNavItems,
  generateSecondaryItems,
} from "@/modules/dashboard/validations/constants";
import { DashboardNavMain } from "@/modules/dashboard/ui/components/dahboard-nav-main";
import { DashboardNavSecondary } from "@/modules/dashboard/ui/components/dashboard-nav-secondary";
import { DashboardUser } from "@/modules/dashboard/ui/components/dashboard-user";
import { Skeleton } from "@delegatte/ui/components/skeleton";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  slug: string;
}

export function DashboardSidebar({ slug, ...props }: DashboardSidebarProps) {
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
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size={"lg"}>
              {isPending ? (
                <Skeleton className="h-9 w-full animate-pulse rounded-md bg-muted" />
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
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <DashboardNavMain items={generatedNavItems} />
        <DashboardNavSecondary items={generatedSecondaryItems} />
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter>
        <DashboardUser />
      </SidebarFooter>
    </Sidebar>
  );
}
