"use client";

import { Input } from "@delegatte/ui/components/input";
import { Textarea } from "@delegatte/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@delegatte/ui/components/select";
import { Calendar } from "@delegatte/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@delegatte/ui/components/popover";
import { Button } from "@delegatte/ui/components/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@delegatte/ui/lib/utils";
import { FormField } from "./form-field";
import { PROJECT_STATUS_OPTIONS } from "../../validations/onboarding-constants";
import {
  OnboardingData,
  ValidationErrors,
} from "../../validations/onboarding-types";

interface ProjectStepProps {
  data: OnboardingData;
  errors: ValidationErrors;
  isLoading: boolean;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

export function ProjectStep({
  data,
  errors,
  isLoading,
  onUpdate,
}: ProjectStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        label="Project Name"
        htmlFor="projectName"
        error={errors.projectName}
        required
      >
        <Input
          id="projectName"
          placeholder="The Last Frontier"
          value={data.projectName}
          onChange={(e: any) => onUpdate({ projectName: e.target.value })}
          className={errors.projectName ? "border-destructive" : ""}
          disabled={isLoading}
          autoFocus
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="projectDescription"
        hint="Brief description of your project"
      >
        <Textarea
          id="projectDescription"
          placeholder="A documentary exploring the final frontiers of human exploration..."
          value={data.projectDescription}
          onChange={(e: any) =>
            onUpdate({ projectDescription: e.target.value })
          }
          rows={3}
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="Project Status"
        htmlFor="status"
        error={errors.status}
        required
      >
        <Select
          value={data.status}
          onValueChange={(value) => onUpdate({ status: value })}
          disabled={isLoading}
        >
          <SelectTrigger className={errors.status ? "border-destructive" : ""}>
            <SelectValue placeholder="Select project status" />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Start Date"
          htmlFor="startDate"
          error={errors.startDate}
          required
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate && "text-muted-foreground",
                  errors.startDate && "border-destructive"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 size-4" />
                {data.startDate ? format(data.startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => onUpdate({ startDate: date })}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </FormField>

        <FormField
          label="End Date"
          htmlFor="endDate"
          error={errors.endDate}
          required
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.endDate && "text-muted-foreground",
                  errors.endDate && "border-destructive"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 size-4" />
                {data.endDate ? format(data.endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.endDate}
                onSelect={(date) => onUpdate({ endDate: date })}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </FormField>
      </div>
    </div>
  );
}
