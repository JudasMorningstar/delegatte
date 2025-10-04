"use client";

import * as React from "react";
import { Loader2, Plus, Building2, ArrowRight, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { toast } from "@delegatte/ui/components/toast";
import { CreateWorkspaceDialog } from "@/modules/auth/ui/components/create-org-dialog";
import { Button } from "@delegatte/ui/components/button";
import { Card } from "@delegatte/ui/components/card";
import { cn } from "@delegatte/ui/lib/utils";
import { LoadingState } from "@/components/loading-state";

export default function Page() {
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const [switchingOrgId, setSwitchingOrgId] = React.useState<string | null>(
    null
  );

  const handleSelectOrganization = async (
    organizationId: string,
    organizationSlug: string,
    organizationName: string
  ) => {
    setSwitchingOrgId(organizationId);

    const switchPromise = authClient.organization
      .setActive({
        organizationId,
        organizationSlug,
      })
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message || "Failed to switch workspace");
        }

        router.push(`/${organizationSlug}/projects`);
        return data;
      })
      .finally(() => {
        setSwitchingOrgId(null);
      });

    toast.promise(switchPromise, {
      loading: `Switching to ${organizationName}...`,
      success: `Switched to ${organizationName}`,
      error: (err) => err.message || "Failed to switch workspace",
    });
  };

  if (isPending) {
    return (
      <LoadingState
        description="Please wait while we load your workspaces."
        title={"Loading..."}
      />
    );
  }

  return (
    <div className="w-full space-y-8 py-8">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          Workspace Selector
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Choose Your Workspace
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Select a workspace to continue or create a new one
        </p>
      </div>

      {!organizations || organizations.length === 0 ? (
        <Card className="relative overflow-hidden border-dashed p-12 text-center mx-auto max-w-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">No Workspaces Yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Get started by creating your first workspace. You can always
                create more later.
              </p>
            </div>
            <CreateWorkspaceDialog
              onSuccess={(newOrg) => {
                router.push(`/${newOrg.slug}/projects`);
              }}
            >
              <Button size="lg" className="gap-2 mt-2">
                <Plus className="h-4 w-4" />
                Create Your First Workspace
              </Button>
            </CreateWorkspaceDialog>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {organizations.map((org) => {
              const isLoading = switchingOrgId === org.id;

              return (
                <Card
                  key={org.id}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 cursor-pointer",
                    "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50",
                    "active:scale-[0.98]",
                    isLoading && "pointer-events-none opacity-60"
                  )}
                  onClick={() =>
                    !isLoading &&
                    handleSelectOrganization(org.id, org.slug, org.name)
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <GeneratedAvatar
                          seed={org.name}
                          variant="botttsNeutral"
                          className="relative h-14 w-14 ring-2 ring-background group-hover:ring-primary/20 transition-all duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                            {org.name}
                          </h3>
                          {/* {org.role === "owner" && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Owner
                          </span>
                        )
                        } */}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          @{org.slug}
                        </p>

                        {org.metadata &&
                          typeof org.metadata === "object" &&
                          "description" in org.metadata &&
                          org.metadata.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                              {String(org.metadata.description)}
                            </p>
                          )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <CreateWorkspaceDialog
            onSuccess={(newOrg) => {
              router.push(`/${newOrg.slug}/projects`);
            }}
          >
            <Button
              variant="outline"
              className="w-full gap-2 h-auto py-4 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-300 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Create New Workspace
            </Button>
          </CreateWorkspaceDialog>
        </div>
      )}
    </div>
  );
}
