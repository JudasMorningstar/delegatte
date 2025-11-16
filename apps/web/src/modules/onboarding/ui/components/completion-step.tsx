"use client";

import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@delegatte/ui/components/button";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/contexts/onboarding-context";
import { TourStep } from "@delegatte/ui/components/guided-tour";
import { Card } from "@delegatte/ui/components/card";

export function CompletionStep() {
  const router = useRouter();
  const { workspaceName, projectName } = useOnboarding();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <TourStep
      id="completion"
      title="You're All Set"
      content="Great! Your workspace, project, and team are ready. Let's get started!"
      order={4}
      position="bottom"
    >
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-20 w-20 text-primary animate-in fade-in zoom-in" />
          </div>

          <h2 className="text-3xl font-bold text-foreground">
            You're all set!
          </h2>

          <p className="text-lg text-muted-foreground max-w-md">
            Your workspace{" "}
            <span className="font-semibold">{workspaceName}</span> and project{" "}
            <span className="font-semibold">{projectName}</span> are ready to
            go.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          <Card className="p-4 bg-card/50 space-y-2">
            <p className="text-sm font-medium text-foreground">Workspace</p>
            <p className="text-muted-foreground text-sm">{workspaceName}</p>
          </Card>
          <Card className="p-4 bg-card/50 space-y-2">
            <p className="text-sm font-medium text-foreground">Project</p>
            <p className="text-muted-foreground text-sm">{projectName}</p>
          </Card>
          <Card className="p-4 bg-card/50 space-y-2">
            <p className="text-sm font-medium text-foreground">Status</p>
            <p className="text-muted-foreground text-sm">Ready to work</p>
          </Card>
        </div>

        <Button onClick={handleGetStarted} size="lg" className="gap-2 mt-4">
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          You can always revisit this onboarding from your settings
        </p>
      </div>
    </TourStep>
  );
}
