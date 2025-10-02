// packages/backend/convex/projects.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    organizationId: v.string(), // Changed from v.id("organization")
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await authComponent.getAuthUser(ctx);

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdBy: identity._id, // This is now a string
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  },
});
