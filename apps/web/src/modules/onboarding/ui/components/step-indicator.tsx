"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useOnboarding } from "@/lib/contexts/onboarding-context";

type Step = {
  id: string;
  label: string;
  description: string;
};

const STEPS: Step[] = [
  { id: "workspace", label: "Workspace", description: "Create your workspace" },
  { id: "project", label: "Project", description: "Create your first project" },
  { id: "members", label: "Team", description: "Invite team members" },
  { id: "complete", label: "Ready", description: "All set!" },
];

export function StepIndicator() {
  const { currentStep } = useOnboarding();

  const getStepStatus = (stepId: string) => {
    const steps = ["workspace", "project", "members", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                    status === "completed"
                      ? "border-primary bg-primary"
                      : status === "active"
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-muted/50"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  ) : (
                    <Circle
                      className={`h-6 w-6 ${
                        status === "active"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      status === "active"
                        ? "text-foreground"
                        : status === "completed"
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`mb-8 h-1 flex-1 mx-2 transition-all ${
                    status === "completed" ? "bg-primary" : "bg-muted"
                  }`}
                  style={{ minWidth: "40px" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
