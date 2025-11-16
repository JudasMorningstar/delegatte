"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { useOnboarding } from "@/lib/contexts/onboarding-context";
import { Card } from "@delegatte/ui/components/card";
import { CreateWorkspaceDialog } from "@/modules/auth/ui/components/create-org-dialog";
import { TourTooltip } from "./tour-tooltip";
import { TourStep } from "@delegatte/ui/components/guided-tour";
import { Button } from "@delegatte/ui/components/button";

export function WorkspaceStep() {
  const { workspaceName, setWorkspace, nextStep } = useOnboarding();

  const handleWorkspaceCreated = (workspace: any) => {
    setWorkspace(workspace.id, workspace.name);
    nextStep();
  };

  return (
    <TourStep
      id="workspace-creation"
      title="Welcome to Onboarding"
      content="Let's start by creating your workspace. A workspace is the main hub for organizing your projects and team members."
      order={1}
      position="bottom"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Let's start with your workspace
          </h2>
          <p className="text-muted-foreground">
            A workspace is the main hub for organizing your projects and team
            members.
          </p>
        </div>

        <Card className="p-8 border-2 border-dashed border-border">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>

            {workspaceName ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✓ Workspace created
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {workspaceName}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    Create Your Workspace
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get started by naming your workspace
                  </p>
                </div>

                <CreateWorkspaceDialog onSuccess={handleWorkspaceCreated}>
                  <Button className="mt-4">Create Workspace</Button>
                </CreateWorkspaceDialog>
              </>
            )}
          </div>
        </Card>
      </div>
    </TourStep>
  );
}
