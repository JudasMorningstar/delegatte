export interface OnboardingData {
  // Step 1: Organization/Workspace
  orgName: string;
  orgSlug: string;
  orgDescription: string;

  // Step 2: Project
  projectName: string;
  projectDescription: string;
  status: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: "workspace" | "project";
}
