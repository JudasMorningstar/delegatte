"use client";

import React from "react";

import { WorkspaceStep } from "./workspace-step";
import { ProjectStep } from "./project-step";
import { CompletionStep } from "./completion-step";
import { Card } from "@delegatte/ui/components/card";
import { useOnboarding } from "@/lib/contexts/onboarding-context";
import {
  TourProvider,
  TourTrigger,
} from "@delegatte/ui/components/guided-tour";
import { MembersStep } from "./member-step";
import { Play } from "lucide-react";
import { Button } from "@delegatte/ui/components/button";

export function OnboardingContainer() {
  const { currentStep, workspaceName, projectName } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case "workspace":
        return <WorkspaceStep />;
      case "project":
        return <ProjectStep />;
      case "members":
        return <MembersStep />;
      case "complete":
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <TourProvider
      autoStart={true}
      onTourComplete={() => console.log("[v0] Onboarding tour completed!")}
      onTourSkip={() => console.log("[v0] Onboarding tour skipped!")}
    >
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full">
                <Play className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Interactive Onboarding
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
                Welcome to Your Journey
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                We'll guide you through a few quick steps to get started
              </p>
              <TourTrigger>
                <Button size="sm" variant="outline" className="mt-2">
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Start Tour
                </Button>
              </TourTrigger>
            </div>

            {/* Progress Indicator */}
            <Card className="p-6 bg-card/50 border border-border/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold flex-shrink-0 ${
                        workspaceName
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      1
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium truncate ${
                          workspaceName
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {workspaceName || "Create Workspace"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-1 flex-1 rounded ${
                      workspaceName && currentStep !== "workspace"
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold flex-shrink-0 ${
                        projectName
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      2
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium truncate ${
                          projectName ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {projectName || "Create Project"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-1 flex-1 rounded ${
                      projectName &&
                      (currentStep === "members" || currentStep === "complete")
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold flex-shrink-0 ${
                        currentStep === "complete" || currentStep === "members"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      3
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium truncate ${
                          currentStep === "complete" ||
                          currentStep === "members"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        Build Team
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Step Content */}
            <div className="animate-in fade-in duration-300">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </TourProvider>
  );
}
