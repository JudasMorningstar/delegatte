import { Label } from "@delegatte/ui/components/label";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}

        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  );
}
