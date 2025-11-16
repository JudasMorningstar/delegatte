"use client";

import React from "react";
import { FolderOpen, Loader2, Loader2Icon } from "lucide-react";
import { Card } from "@delegatte/ui/components/card";
import { Button } from "@delegatte/ui/components/button";
import { Input } from "@delegatte/ui/components/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@delegatte/ui/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@delegatte/ui/components/toast";
import { useOnboarding } from "@/lib/contexts/onboarding-context";
import { TourTooltip } from "./tour-tooltip";
import { TourStep } from "@delegatte/ui/components/guided-tour";

const projectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(50, "Project name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectStep() {
  const { projectName, setProject, nextStep, previousStep } = useOnboarding();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => {
      setTimeout(() => {
        setProject(Math.random().toString(), values.name);
        form.reset();
        nextStep();
        resolve(null);
      }, 1000);
    });

    setIsLoading(false);
  };

  return (
    <TourStep
      id="project-creation"
      title="Create Your First Project"
      content="Enter a name for your project to get started. You can add more details and settings later!"
      order={2}
      position="bottom"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Now, create your first project
          </h2>
          <p className="text-muted-foreground">
            Projects help you organize work, collaborate, and manage your
            workflow.
          </p>
        </div>

        <Card className="p-8">
          {projectName ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✓ Project created
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {projectName}
                </p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Project Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My Amazing Project"
                          {...field}
                          disabled={isLoading}
                          autoFocus
                        />
                      </FormControl>
                      <FormDescription>
                        This is your project's display name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What is this project about?"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Create Project
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </Card>
      </div>
    </TourStep>
  );
}
