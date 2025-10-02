"use client";

import { Input } from "@delegatte/ui/components/input";
import { Textarea } from "@delegatte/ui/components/textarea";
// import { FormField } from "./form-field";
import type {
  OnboardingData,
  ValidationErrors,
} from "@/modules/onboarding/validations/onboarding-types";
import { Sparkles } from "lucide-react";
import { FormField } from "./form-field";

interface WorkspaceStepProps {
  data: OnboardingData;
  errors: ValidationErrors;
  isLoading: boolean;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

export function WorkspaceStep({
  data,
  errors,
  isLoading,
  onUpdate,
}: WorkspaceStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        label="Workspace Name"
        htmlFor="orgName"
        error={errors.orgName}
        required
      >
        <Input
          id="orgName"
          placeholder="Acme Studios"
          value={data.orgName}
          onChange={(e: any) => onUpdate({ orgName: e.target.value })}
          className={errors.orgName ? "border-destructive" : ""}
          disabled={isLoading}
          autoFocus
        />
      </FormField>

      <FormField
        label={
          <span className="flex items-center gap-2">
            Workspace Slug
            <Sparkles className="size-3 text-muted-foreground" />
          </span>
        }
        htmlFor="orgSlug"
        error={errors.orgSlug}
        required
        hint="Auto-generated from name. Use lowercase letters, numbers, and hyphens"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            app.delegatte.com/
          </span>
          <Input
            id="orgSlug"
            placeholder="acme-studios"
            value={data.orgSlug}
            onChange={(e: any) => onUpdate({ orgSlug: e.target.value })}
            className={errors.orgSlug ? "border-destructive" : ""}
            disabled={isLoading}
          />
        </div>
      </FormField>

      <FormField
        label="Description"
        htmlFor="orgDescription"
        hint="Optional: Tell us about your workspace"
      >
        <Textarea
          id="orgDescription"
          placeholder="A production company focused on documentary filmmaking..."
          value={data.orgDescription}
          onChange={(e: any) => onUpdate({ orgDescription: e.target.value })}
          rows={3}
          disabled={isLoading}
        />
      </FormField>
    </div>
  );
}
