import type { StepConfig } from "./onboarding";

export const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Create Your Workspace",
    description: "A workspace helps you organize your projects and team",
    icon: "workspace",
  },
  {
    id: 2,
    title: "Setup Your First Project",
    description: "Tell us about your film production project",
    icon: "project",
  },
];

export const PROJECT_STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "pre-production", label: "Pre-Production" },
  { value: "production", label: "Production" },
  { value: "post-production", label: "Post-Production" },
  { value: "completed", label: "Completed" },
];
