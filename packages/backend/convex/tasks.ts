import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkProjectAccess } from "./projectMembers";

// Create task (contributor+)
export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    notes: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check project access - contributor or higher
    const { identity, membership } = await checkProjectAccess(
      ctx,
      args.projectId,
      "contributor"
    );

    // If assigning to someone, verify they're a project member
    if (args.assignedTo) {
      const assignee = await ctx.db
        .query("projectMembers")
        .withIndex("by_project_user", (q: any) =>
          q.eq("projectId", args.projectId).eq("userId", args.assignedTo)
        )
        .first();

      if (!assignee || !assignee.isActive) {
        throw new Error("Cannot assign task to non-member");
      }
    }

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdBy: identity._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return taskId;
  },
});

// Update task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");

    // Check project access
    const { identity, membership } = await checkProjectAccess(
      ctx,
      task.projectId,
      "contributor"
    );

    // Contributors can only update their own tasks or tasks assigned to them
    if (membership.role === "contributor") {
      const canUpdate =
        task.createdBy === identity._id || task.assignedTo === identity._id;

      if (!canUpdate) {
        throw new Error("Can only update tasks you created or are assigned to");
      }
    }

    // If reassigning, verify new assignee is a member
    if (updates.assignedTo) {
      const assignee = await ctx.db
        .query("projectMembers")
        .withIndex("by_project_user", (q: any) =>
          q.eq("projectId", task.projectId).eq("userId", updates.assignedTo)
        )
        .first();

      if (!assignee || !assignee.isActive) {
        throw new Error("Cannot assign task to non-member");
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete task (manager+ or creator)
export const deleteTask = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    const { identity, membership } = await checkProjectAccess(
      ctx,
      task.projectId,
      "contributor"
    );

    // Only manager+ or task creator can delete
    const canDelete =
      membership.role === "owner" ||
      membership.role === "manager" ||
      task.createdBy === identity._id;

    if (!canDelete) {
      throw new Error("Only managers or task creator can delete tasks");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// List tasks for project
export const listByProject = query({
  args: {
    projectId: v.id("projects"),
    status: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify project access
    await checkProjectAccess(ctx, args.projectId);

    let tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Filter by status
    if (args.status) {
      tasks = tasks.filter((t) => t.status === args.status);
    }

    // Filter by assignee
    if (args.assignedTo) {
      tasks = tasks.filter((t) => t.assignedTo === args.assignedTo);
    }

    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get my tasks (assigned to me)
export const getMyTasks = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const { identity } = await checkProjectAccess(ctx, args.projectId);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_assignedTo", (q) => q.eq("assignedTo", identity._id))
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();

    return tasks.sort((a, b) => {
      // Sort by due date, then by creation date
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      return b.createdAt - a.createdAt;
    });
  },
});
