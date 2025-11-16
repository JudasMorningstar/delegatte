import { z } from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@delegatte/ui/components/toast";
import { Button } from "@delegatte/ui/components/button";
import { Checkbox } from "@delegatte/ui/components/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@delegatte/ui/components/form";
import { Input } from "@delegatte/ui/components/input";
import { Textarea } from "@delegatte/ui/components/textarea";
import { cn } from "@delegatte/ui/lib/utils";
import {
  projectInsertSchema,
  projectUpdateSchema,
} from "../../validations/schemas";

interface ProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: ProjectGetAllItem;
}

type ProjectFormValues = z.infer<typeof projectInsertSchema>;
type ProjectUpdateValues = z.infer<typeof projectUpdateSchema>;

export const ProjectForm = ({
  onCancel,
  onSuccess,
  initialValues,
}: ProjectFormProps) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      status: initialValues?.status ?? "planning",
      startDate: initialValues?.startDate
        ? new Date(initialValues.startDate)
        : undefined,
      endDate: initialValues?.endDate
        ? new Date(initialValues.endDate)
        : undefined,
      isActive: initialValues?.isActive ?? true,
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createProject.isPending || updateProject.isPending;

  const onSubmit = (values: ProjectFormValues) => {
    if (isEdit) {
      // For update, we need to include the ID and only send changed fields
      const updateData: ProjectUpdateValues = {
        id: initialValues!.id,
        name: values.name,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
        isActive: values.isActive,
      };
      const updatePromise = updateProject.mutateAsync(updateData);
      toast.promise(updatePromise, {
        loading: `Updating "${updateData.name}"...`,
        success: `"${updateData.name}" updated successfully`,
        error: (error) =>
          `Failed to update project: ${error.message || "Unknown error"}`,
      });
    } else {
      const createPromise = createProject.mutateAsync(values);
      toast.promise(createPromise, {
        loading: `Creating "${values.name}"...`,
        success: `"${values.name}" created successfully`,
        error: (error) =>
          `Failed to create project: ${error.message || "Unknown error"}`,
      });
    }
  };

  const statusOptions = statusEnum.options;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Project Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormDescription>
                Name must be at least 3 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description (optional)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Describe what this project is about
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick an end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01") ||
                        (form.getValues("startDate") != null &&
                          date <= new Date(form.getValues("startDate") as Date))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>{" "}
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          {/* Is Active */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active Project</FormLabel>
                  <FormDescription>
                    Whether this project is currently active
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Project"
                : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
