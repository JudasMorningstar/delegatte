"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@delegatte/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@delegatte/ui/components/dropdown-menu";
import { toast } from "@delegatte/ui/components/toast";
import { CreateOrgDialog } from "@/modules/auth/ui/components/create-org-dialog";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export function OrgSwitcher({
  organizations,
}: {
  organizations: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null | undefined;
    metadata?: any;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeOrg, setActiveOrg] = React.useState(organizations[0]);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!activeOrg) {
    return null;
  }

  const handleOrgSwitch = async (org: (typeof organizations)[0]) => {
    if (org.id === activeOrg.id) return; // Already active

    setIsLoading(true);

    const switchPromise = authClient.organization
      .setActive({
        organizationId: org.id,
        organizationSlug: org.slug,
      })
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message || "Failed to switch workspace");
        }

        // Update local state only if API call succeeds
        setActiveOrg(org);
        return data;
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(switchPromise, {
      loading: `Switching to ${org.name}...`,
      success: `Switched to ${org.name}`,
      error: (err) => err.message || "Failed to switch workspace",
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={isLoading}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GeneratedAvatar
                  seed={activeOrg.name}
                  variant="botttsNeutral"
                  className="size-4"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrg.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {organizations.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleOrgSwitch(org)}
                className="gap-2 p-2"
                disabled={isLoading || org.id === activeOrg.id}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <GeneratedAvatar
                    seed={org.name}
                    variant="botttsNeutral"
                    className="size-3.5 shrink-0"
                  />
                </div>
                {org.name}
                {org.id === activeOrg.id && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Active
                  </span>
                )}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <CreateOrgDialog
              onSuccess={(newOrg) => {
                // Optionally refresh organizations list or navigate
                redirect(`/org/${newOrg.slug}/projects`); // Navigate to new org
              }}
            >
              <DropdownMenuItem
                className="gap-2 p-2"
                disabled={isLoading}
                onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add workspace
                </div>
              </DropdownMenuItem>
            </CreateOrgDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
