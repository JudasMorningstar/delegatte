import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Helper to check project membership and role
async function checkProjectAccess(
  ctx: any,
  projectId: any,
  requiredRole?: "owner" | "manager" | "contributor" | "viewer"
) {
  const identity = await authComponent.getAuthUser(ctx);
  if (!identity) throw new Error("Not authenticated");

  const membership = await ctx.db
    .query("projectMembers")
    .withIndex("by_project_user", (q: any) =>
      q.eq("projectId", projectId).eq("userId", identity._id)
    )
    .first();

  if (!membership || !membership.isActive) {
    throw new Error("Not a member of this project");
  }

  if (requiredRole) {
    const roleHierarchy = { owner: 4, manager: 3, contributor: 2, viewer: 1 };
    const userLevel =
      roleHierarchy[membership.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      throw new Error(`Insufficient permissions. Required: ${requiredRole}`);
    }
  }

  return { identity, membership };
}

// Invite a member to project
export const inviteMember = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.string(),
    role: v.string(),
    dailyRate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only owner or manager can invite
    const { identity } = await checkProjectAccess(
      ctx,
      args.projectId,
      "manager"
    );

    // Check if already a member
    const existing = await ctx.db
      .query("projectMembers")
      .withIndex("by_project_user", (q: any) =>
        q.eq("projectId", args.projectId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      throw new Error("User is already a member of this project");
    }

    const memberId = await ctx.db.insert("projectMembers", {
      projectId: args.projectId,
      userId: args.userId,
      role: args.role,
      daysBooked: [],
      dailyRate: args.dailyRate,
      notes: args.notes,
      invitedBy: identity._id,
      joinedAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    });

    return memberId;
  },
});

// Update member role (only owner/manager)
export const updateMemberRole = mutation({
  args: {
    memberId: v.id("projectMembers"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Check permissions
    const { membership } = await checkProjectAccess(
      ctx,
      member.projectId,
      "manager"
    );

    // Owners cannot be demoted (unless by themselves)
    if (member.role === "owner" && membership.role !== "owner") {
      throw new Error("Only project owner can change owner role");
    }

    await ctx.db.patch(args.memberId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return args.memberId;
  },
});

// Update member's booked days
export const updateBookedDays = mutation({
  args: {
    memberId: v.id("projectMembers"),
    daysBooked: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await authComponent.getAuthUser(ctx);
    if (!identity) throw new Error("Not authenticated");

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Check if user is updating their own schedule or has manager+ role
    const { membership } = await checkProjectAccess(ctx, member.projectId);

    const canUpdate =
      membership.userId === member.userId ||
      membership.role === "owner" ||
      membership.role === "manager";

    if (!canUpdate) {
      throw new Error("Cannot update other members' schedules");
    }

    await ctx.db.patch(args.memberId, {
      daysBooked: args.daysBooked,
      updatedAt: Date.now(),
    });

    return args.memberId;
  },
});

// Remove member from project
export const removeMember = mutation({
  args: {
    memberId: v.id("projectMembers"),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Only owner/manager can remove members
    await checkProjectAccess(ctx, member.projectId, "manager");

    // Don't allow removing the owner
    if (member.role === "owner") {
      throw new Error("Cannot remove project owner");
    }

    // Soft delete
    await ctx.db.patch(args.memberId, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return args.memberId;
  },
});

// List project members
export const listMembers = query({
  args: {
    projectId: v.id("projects"),
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this project
    await checkProjectAccess(ctx, args.projectId);

    let members = await ctx.db
      .query("projectMembers")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    if (!args.includeInactive) {
      members = members.filter((m) => m.isActive);
    }

    return members.sort((a, b) => b.joinedAt - a.joinedAt);
  },
});

// Get user's role in project
export const getMyRole = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const { membership } = await checkProjectAccess(ctx, args.projectId);

    const roleHierarchy = { owner: 4, manager: 3, contributor: 2, viewer: 1 };
    const level =
      roleHierarchy[membership.role as keyof typeof roleHierarchy] || 0;

    return {
      role: membership.role,
      canInviteMembers: level >= 3, // manager+
      canManageTasks: level >= 2, // contributor+
      canUpdateSchedule: true, // all members can update their own
      canRemoveMembers: level >= 3, // manager+
      isOwner: membership.role === "owner",
    };
  },
});

export { checkProjectAccess };
