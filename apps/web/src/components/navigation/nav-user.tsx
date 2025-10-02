"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Icons } from "@/components/icons";

import { signOut, useSession } from "@/lib/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@delegatte/ui/components/avatar";
import { Button } from "@delegatte/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@delegatte/ui/components/dropdown-menu";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@delegatte/ui/components/sidebar";
import { Skeleton } from "@delegatte/ui/components/skeleton";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, isPending } = useSession();
  const router = useRouter();

  if (isPending || !data?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                <Skeleton className="h-8 w-8 rounded-lg" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 ml-2 gap-1">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-3 w-16 rounded-lg" />
            </div>
            <Skeleton className="ml-auto h-4 w-4 rounded-lg" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {data.user.image ? (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data.user.image} alt={data.user.name} />
                </Avatar>
              ) : (
                <GeneratedAvatar seed={data.user.name} variant={"initials"} />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold capitalize">
                  {data?.user.name ?? ""}
                </span>
                <span className="truncate text-xs">{data?.user.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={data?.user.image ?? ""}
                    alt={data?.user.name ?? ""}
                  />
                  <GeneratedAvatar seed={data.user.name} variant={"initials"} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold capitalize">
                    {data?.user.name ?? ""}
                  </span>
                  <span className="truncate text-xs">
                    {data?.user.email ?? ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icons.settings className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.credit className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.info className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="text-sm"
                size={"sm"}
                onClick={async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/sign-in"); // redirect to login page
                      },
                    },
                  });
                }}
              >
                <Icons.logout className="h-4 w-4" />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
