"use client";

import * as React from "react";
import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
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
import { GeneratedAvatar } from "@/components/generated-avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { CreateWorkspaceDialog } from "@/modules/auth/ui/components/create-org-dialog";

interface WorkspaceSwitcherProps {
  organizations: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null;
    metadata?: any;
  }[];
}

export function WorkspaceSwitcher({ organizations }: WorkspaceSwitcherProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const currentSlug = params.slug as string;

  // Find active workspace based on current URL slug
  const activeWorkspace = React.useMemo(() => {
    return (
      organizations.find((org) => org.slug === currentSlug) || organizations[0]
    );
  }, [organizations, currentSlug]);

  const [switchingWorkspace, setSwitchingWorkspace] = React.useState<
    string | null
  >(null);

  if (!activeWorkspace) return null;

  const handleWorkspaceSwitch = async (org: (typeof organizations)[0]) => {
    if (org.id === activeWorkspace.id) return;

    setSwitchingWorkspace(org.id);

    const switchPromise = authClient.organization
      .setActive({
        organizationId: org.id,
        organizationSlug: org.slug,
      })
      .then(({ data, error }) => {
        if (error)
          throw new Error(error.message || "Failed to switch workspace");

        // Navigate to the new workspace
        router.push(`/${org.slug}/projects`);
        return data;
      })
      .finally(() => {
        setSwitchingWorkspace(null);
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
              disabled={switchingWorkspace !== null}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
            >
              <GeneratedAvatar
                seed={activeWorkspace.name}
                variant="botttsNeutral"
                className="size-8 rounded-lg shrink-0"
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeWorkspace.name}
                </span>
              </div>

              {switchingWorkspace ? (
                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
              ) : (
                <ChevronsUpDown className="ml-auto" />
              )}
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
                onClick={() => handleWorkspaceSwitch(org)}
                disabled={
                  switchingWorkspace !== null || org.id === activeWorkspace.id
                }
                className="gap-2 p-2"
              >
                <GeneratedAvatar
                  seed={org.name}
                  variant="botttsNeutral"
                  className="size-3.5 shrink-0"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="truncate">{org.name}</span>
                  {org.id === activeWorkspace.id && !switchingWorkspace && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Active
                    </span>
                  )}
                  {switchingWorkspace === org.id && (
                    <Loader2 className="h-3 w-3 animate-spin ml-2" />
                  )}
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <CreateWorkspaceDialog
              onSuccess={(newOrg) => {
                router.push(`/${newOrg.slug}/projects`);
              }}
            >
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground ">
                  Add workspace
                </div>
              </DropdownMenuItem>
            </CreateWorkspaceDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
