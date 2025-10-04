import type { OnboardingData, ValidationErrors } from "./onboarding-types";

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateWorkspaceStep(data: OnboardingData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.orgName.trim()) {
    errors.orgName = "Workspace name is required";
  } else if (data.orgName.length < 2) {
    errors.orgName = "Workspace name must be at least 2 characters";
  } else if (data.orgName.length > 50) {
    errors.orgName = "Workspace name must be less than 50 characters";
  }

  if (!data.orgSlug.trim()) {
    errors.orgSlug = "Workspace slug is required";
  } else if (!/^[a-z0-9-]+$/.test(data.orgSlug)) {
    errors.orgSlug =
      "Slug can only contain lowercase letters, numbers, and hyphens";
  } else if (data.orgSlug.length < 2) {
    errors.orgSlug = "Slug must be at least 2 characters";
  } else if (data.orgSlug.length > 50) {
    errors.orgSlug = "Slug must be less than 50 characters";
  }

  if (data.orgDescription && data.orgDescription.length > 500) {
    errors.orgDescription = "Description must be less than 500 characters";
  }

  return errors;
}

export function validateProjectStep(data: OnboardingData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.projectName.trim()) {
    errors.projectName = "Project name is required";
  } else if (data.projectName.length < 2) {
    errors.projectName = "Project name must be at least 2 characters";
  } else if (data.projectName.length > 100) {
    errors.projectName = "Project name must be less than 100 characters";
  }

  if (data.projectDescription && data.projectDescription.length > 1000) {
    errors.projectDescription = "Description must be less than 1000 characters";
  }

  if (!data.status) {
    errors.status = "Project status is required";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  }

  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    errors.endDate = "End date must be after start date";
  }

  return errors;
}
