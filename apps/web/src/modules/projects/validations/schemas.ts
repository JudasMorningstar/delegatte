import { z } from "zod";

export const statusEnum = z.enum([
  "planning", // Initial phase, brainstorming, scheduling
  "in_progress", // Actively being worked on (shooting/post/etc.)
  "completed", // Fully done and delivered
  "on_hold", // Temporarily paused (waiting on feedback, etc.)
  "archived", // Closed or no longer active, kept for reference
]);

export const dateSchema = z.coerce.date();

export const projectInsertSchema = z
  .object({
    name: z.string().min(3),
    description: z.string().nullable().optional(),
    status: statusEnum, // required
    startDate: dateSchema, // Now required instead of optional
    endDate: dateSchema, // Now required instead of optional
    isActive: z.boolean(), // required
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    path: ["endDate"],
    message: "End date must be after start date",
  });

export const projectUpdateSchema = z
  .object({
    id: z.string(),
    name: z.string().min(3),
    description: z.string().nullable().optional(),
    status: statusEnum,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.endDate > data.startDate,
    {
      path: ["endDate"],
      message: "End date must be after start date",
    }
  );

export const addToProjectSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  dailyRate: z.number().optional(),
  notes: z.string().optional(),
});

export const updateProjectMemberSchema = addToProjectSchema.extend({
  id: z.string(), // required
});

export const calendarEventsInput = z.object({
  mode: z.enum(["projects", "mySchedule", "teamSchedule"]).default("projects"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  projectIds: z.array(z.string()).optional(), // Allow filtering by specific projects
});
