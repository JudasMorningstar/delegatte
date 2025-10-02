import type { OnboardingData, ValidationErrors } from "./onboarding-types";

export function validateWorkspaceStep(data: OnboardingData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.orgName.length < 2) {
    errors.orgName = "Organization name must be at least 2 characters";
  }

  if (data.orgSlug.length < 2) {
    errors.orgSlug = "Slug must be at least 2 characters";
  }

  if (!/^[a-z0-9-]+$/.test(data.orgSlug)) {
    errors.orgSlug =
      "Slug can only contain lowercase letters, numbers, and hyphens";
  }

  return errors;
}

export function validateProjectStep(data: OnboardingData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.projectName.length < 3) {
    errors.projectName = "Project name must be at least 3 characters";
  }

  if (!data.status) {
    errors.status = "Please select a project status";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  }

  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    errors.endDate = "End date must be after start date";
  }

  return errors;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
