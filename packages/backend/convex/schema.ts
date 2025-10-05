// packages/backend/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    organizationId: v.string(), // Correct - Better Auth uses strings
    isActive: v.boolean(),
    createdBy: v.string(), // Correct - Better Auth uses strings
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("organizationId", ["organizationId"])
    .index("createdBy", ["createdBy"]),

  projectMembers: defineTable({
    projectId: v.id("projects"), // CHANGED: Should be v.id for Convex references
    userId: v.string(), // Correct - Better Auth user ID
    role: v.string(),
    daysBooked: v.array(v.string()),
    dailyRate: v.optional(v.string()),
    notes: v.optional(v.string()),
    addedBy: v.string(), // Renamed from invitedBy
    addedAt: v.number(), // Renamed from joinedAt
    updatedAt: v.number(),
    canManage: v.boolean(),
    isActive: v.boolean(),
  })
    .index("by_project_user", ["projectId", "userId"])
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"]),

  tasks: defineTable({
    projectId: v.id("projects"), // CHANGED: Should be v.id for Convex references
    title: v.string(),
    description: v.optional(v.string()), // ADDED: Missing from your schema
    notes: v.optional(v.string()),
    status: v.string(),
    assignedTo: v.optional(v.string()), // Better Auth user ID
    dueDate: v.optional(v.number()),
    createdBy: v.string(), // CHANGED: Should be string for Better Auth
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_createdBy", ["createdBy"])
    .index("by_status", ["status"]),

  taskItems: defineTable({
    taskId: v.id("tasks"), // CHANGED: Should be v.id for Convex references
    title: v.string(),
    location: v.optional(v.string()),
    priority: v.string(),
    isCompleted: v.boolean(),
    attachments: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    completedBy: v.optional(v.string()), // Better Auth user ID
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_completedBy", ["completedBy"]),
});
