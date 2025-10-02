"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Sparkles, Film } from "lucide-react";

import { Button } from "@delegatte/ui/components/button";
import { Card, CardContent } from "@delegatte/ui/components/card";
import { api } from "@delegatte/backend/_generated/api";
import { toast } from "@delegatte/ui/components/toast";

import { authClient } from "@/lib/auth-client";
import {
  ValidationErrors,
  OnboardingData,
} from "@/modules/onboarding/validations/onboarding-types";
import {
  generateSlug,
  validateWorkspaceStep,
  validateProjectStep,
} from "@/modules/onboarding/validations/onboarding-validation";
import { ProjectStep } from "@/modules/onboarding/ui/components/project-step";
import { StepIndicator } from "@/modules/onboarding/ui/components/step-indicator";
import { WorkspaceStep } from "@/modules/onboarding/ui/components/workspace-step";

export const OnboardingPageView = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const createProject = useMutation(api.projects.create);

  const [data, setData] = useState<OnboardingData>({
    orgName: "",
    orgSlug: "",
    orgDescription: "",
    projectName: "",
    projectDescription: "",
    status: "",
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    if (data.orgName) {
      setData((prev) => ({ ...prev, orgSlug: generateSlug(data.orgName) }));
    }
  }, [data.orgName]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  const handleNext = () => {
    const validationErrors = validateWorkspaceStep(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleFinish = async () => {
    const validationErrors = validateProjectStep(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const onboardingPromise = (async () => {
      const orgResult = await authClient.organization.create({
        name: data.orgName,
        slug: data.orgSlug,
        metadata: data.orgDescription
          ? { description: data.orgDescription }
          : undefined,
      });

      if (orgResult.error) {
        throw new Error(
          orgResult.error.message || "Failed to create workspace"
        );
      }

      const organization = orgResult.data;

      const setActiveResult = await authClient.organization.setActive({
        organizationId: organization.id,
      });

      if (setActiveResult.error) {
        throw new Error("Failed to set active workspace");
      }

      const projectId = await createProject({
        name: data.projectName,
        description: data.projectDescription || undefined,
        status: data.status,
        startDate: data.startDate!.getTime(),
        endDate: data.endDate!.getTime(),
        organizationId: organization.id,
        isActive: true,
      });

      return { organization, projectId };
    })()
      .then(({ organization }) => {
        router.push(`/${organization.slug}/projects`);
        return { organization };
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(onboardingPromise, {
      loading: "Setting up your workspace...",
      success: "Workspace and project created successfully!",
      error: (err) => err.message || "Failed to complete setup",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-primary/10 mb-4">
            <Film className="size-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome to Delegatte
          </h1>
          <p className="text-muted-foreground">
            Let's set up your workspace and first project
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <Card className="border-border bg-card">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <WorkspaceStep
                data={data}
                errors={errors}
                isLoading={isLoading}
                onUpdate={updateData}
              />
            )}

            {currentStep === 2 && (
              <ProjectStep
                data={data}
                errors={errors}
                isLoading={isLoading}
                onUpdate={updateData}
              />
            )}

            <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
                className="gap-2 bg-transparent"
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>

              {currentStep < 2 ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <span>Creating...</span>
                      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      Finish Setup
                      <Sparkles className="size-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have a workspace?{" "}
          <button
            onClick={() => router.push("/projects")}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            Skip to projects
          </button>
        </p>
      </div>
    </div>
  );
};
