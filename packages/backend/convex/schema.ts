// packages/backend/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { s } from "node_modules/better-auth/dist/shared/better-auth.DOq11zLi";

export default defineSchema({
  // Projects table
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    organizationId: v.string(), // Changed from v.id("organization")
    isActive: v.boolean(),
    createdBy: v.string(), // Changed from v.string()
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("organizationId", ["organizationId"])
    .index("createdBy", ["createdBy"]),

  // Project members table
  projectMembers: defineTable({
    projectId: v.string(), // Changed from v.id("projects")
    userId: v.string(),
    role: v.string(),
    daysBooked: v.array(v.string()), // Store as ISO date string, or use v.number() for timestamp
    dailyRate: v.optional(v.string()), // Use string for decimal, or v.float64()
    notes: v.optional(v.string()),
    invitedBy: v.string(),
    joinedAt: v.number(), // Timestamp (ms since epoch)
    updatedAt: v.number(), // Timestamp (ms since epoch)
    isActive: v.boolean(),
  })
    .index("by_project_user", ["projectId", "userId"]) // For uniqueness
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"]),

  tasks: defineTable({
    projectId: v.string(),
    title: v.string(),
    notes: v.optional(v.string()),
    // status: v.union(
    //   v.literal("todo"),
    //   v.literal("in_progress"),
    //   v.literal("completed")
    // ), // Enum as union of literals
    status: v.string(), // Store enum values as strings in Convex
    assignedTo: v.optional(v.string()), // Nullable reference
    dueDate: v.optional(v.number()), // Store ISO date string, or use v.optional(v.number()) for timestamp
    createdBy: v.id("user"),
    createdAt: v.number(), // Timestamp (ms since epoch)
    updatedAt: v.number(), // Timestamp (ms since epoch)
  })
    .index("by_project", ["projectId"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_createdBy", ["createdBy"])
    .index("by_status", ["status"]),

  // Task Items table
  taskItems: defineTable({
    taskId: v.string(), // Reference to tasks table
    title: v.string(),
    location: v.optional(v.string()),
    priority: v.string(), // Enum values are stored as strings in Convex
    isCompleted: v.boolean(),
    attachments: v.optional(v.array(v.string())), // Array of strings for attachments
    notes: v.optional(v.string()),
    completedAt: v.optional(v.number()), // Timestamps as numbers (ms since epoch)
    completedBy: v.optional(v.string()), // Reference to users table, nullable
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_completedBy", ["completedBy"]),
});
