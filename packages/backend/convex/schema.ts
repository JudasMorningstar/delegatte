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
    organizationId: v.string(), // Changed from v.id("organization")
    isActive: v.boolean(),
    createdBy: v.string(), // Changed from v.id("user")
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("organizationId", ["organizationId"])
    .index("createdBy", ["createdBy"]),
});
