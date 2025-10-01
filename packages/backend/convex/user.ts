import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("user").collect();
    return users;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
