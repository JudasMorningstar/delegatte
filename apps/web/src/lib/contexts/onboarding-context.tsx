"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type OnboardingStep = "workspace" | "project" | "members" | "complete";

interface OnboardingContextType {
  currentStep: OnboardingStep;
  workspaceId: string | null;
  workspaceName: string | null;
  projectId: string | null;
  projectName: string | null;
  setWorkspace: (id: string, name: string) => void;
  setProject: (id: string, name: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipMembers: () => void;
  resetOnboarding: () => void;
  isCompleted: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("workspace");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const setWorkspace = useCallback((id: string, name: string) => {
    setWorkspaceId(id);
    setWorkspaceName(name);
  }, []);

  const setProject = useCallback((id: string, name: string) => {
    setProjectId(id);
    setProjectName(name);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === "workspace") return "project";
      if (prev === "project") return "members";
      if (prev === "members") return "complete";
      return "complete";
    });
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === "project") return "workspace";
      if (prev === "members") return "project";
      return prev;
    });
  }, []);

  const skipMembers = useCallback(() => {
    setCurrentStep("complete");
    setIsCompleted(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setCurrentStep("workspace");
    setWorkspaceId(null);
    setWorkspaceName(null);
    setProjectId(null);
    setProjectName(null);
    setIsCompleted(false);
  }, []);

  const value: OnboardingContextType = {
    currentStep,
    workspaceId,
    workspaceName,
    projectId,
    projectName,
    setWorkspace,
    setProject,
    nextStep,
    previousStep,
    skipMembers,
    resetOnboarding,
    isCompleted,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
