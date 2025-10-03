"use client";

import * as React from "react";
import { Loader2Icon, Building2, Sparkles, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@delegatte/ui/components/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@delegatte/ui/components/form";
import { Input } from "@delegatte/ui/components/input";
import { Button } from "@delegatte/ui/components/button";
import { Textarea } from "@delegatte/ui/components/textarea";
import { authClient } from "@/lib/auth-client";
import { toast } from "@delegatte/ui/components/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { redirect, useRouter } from "next/navigation";

const orgSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

type OrgFormValues = z.infer<typeof orgSchema>;

interface CreateWorkspaceDialogProps {
  children?: React.ReactNode;
  onSuccess?: (organization: any) => void;
}

export function CreateWorkspaceDialog({
  children,
  onSuccess,
}: CreateWorkspaceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Auto-generate slug from name
  const watchName = form.watch("name");
  React.useEffect(() => {
    if (watchName && !form.formState.dirtyFields.slug) {
      const generatedSlug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", generatedSlug);
    }
  }, [watchName, form]);

  const onSubmit = async (values: OrgFormValues) => {
    setIsLoading(true);

    const createPromise = authClient.organization
      .create({
        name: values.name,
        slug: values.slug || "",
        metadata: values.description
          ? { description: values.description }
          : undefined,
      })
      .then(async ({ data, error }) => {
        if (error) {
          throw new Error(error.message || "Failed to create organization");
        }

        if (!data) throw new Error("No organization returned");

        await authClient.organization.setActive({
          organizationId: data.id,
          organizationSlug: data.slug,
        });

        form.reset();
        setOpen(false);

        onSuccess?.(data);

        if (data.slug) {
          router.push(`/${data.slug}/projects`);
        }

        return data;
      })
      .finally(() => {
        setIsLoading(false);
      });

    toast.promise(createPromise, {
      loading: "Creating workspace...",
      success: "Workspace created successfully!",
      error: (err) => err.message || "Failed to create workspace",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full justify-start gap-2">
            <Plus className="size-4" />
            Create Workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create Workspace</DialogTitle>
              <DialogDescription>
                Set up a new workspace for your team
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corporation"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your organization's display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Workspace Slug
                    <Sparkles className="size-3 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        app.example.com/
                      </span>
                      <Input
                        placeholder="acme-corp"
                        {...field}
                        disabled={isLoading}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Auto-generated from name. Use lowercase letters, numbers,
                    and hyphens
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your workspace..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your workspace
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 size-4" />
                    Create Workspace
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
