// packages/backend/convex/projects.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { findOne } from "./betterAuth/adapter";

// Helper function to check organization membership and permissions
// Helper function to check organization membership and permissions
async function checkOrgPermission(
  ctx: any,
  organizationId: string,
  requiredRole?: "owner" | "admin" | "member"
) {
  const identity = await authComponent.getAuthUser(ctx);

  if (!identity) {
    throw new Error("Not authenticated");
  }

  // Get user's organization membership from Better Auth's member table
  const membership = await ctx.runQuery(findOne, {
    model: "member",
    where: [
      { field: "userId", value: identity._id },
      { field: "organizationId", value: organizationId },
    ],
  });

  console.log("Membership:", membership);

  if (!membership) {
    throw new Error("Not a member of this organization");
  }

  // Check role requirements
  if (requiredRole) {
    const roleHierarchy = { owner: 3, admin: 2, member: 1 };
    const userRoleLevel =
      roleHierarchy[membership.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredLevel) {
      throw new Error(`Insufficient permissions. Required: ${requiredRole}`);
    }
  }

  return { identity, membership };
}

// Helper to check if user can modify a specific project
async function checkProjectPermission(
  ctx: any,
  projectId: any,
  allowCreator: boolean = true
) {
  const identity = await authComponent.getAuthUser(ctx);

  if (!identity) {
    throw new Error("Not authenticated");
  }

  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Check organization membership
  const { membership } = await checkOrgPermission(ctx, project.organizationId);

  // Owners and admins can always modify
  if (membership.role === "owner" || membership.role === "admin") {
    return { identity, project, membership };
  }

  // Check if user is the creator (if allowed)
  if (allowCreator && project.createdBy === identity._id) {
    return { identity, project, membership };
  }

  throw new Error("Insufficient permissions to modify this project");
}

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    organizationId: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user is a member of the organization (members can create projects)
    const identity = await authComponent.getAuthUser(ctx);

    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdBy: identity._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  },
});
