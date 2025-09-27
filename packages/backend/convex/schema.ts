import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }).index("byEmail", ["email"]),
  posts: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    content: v.string(),
    published: v.boolean(),
  }).index("byAuthor", ["authorId"]),
});
