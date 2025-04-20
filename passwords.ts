import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generatePassword = mutation({
  args: {
    length: v.number(),
    includeNumbers: v.boolean(),
    includeSymbols: v.boolean(),
    includeUppercase: v.boolean(),
  },
  handler: async (ctx, args) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let validChars = chars;
    if (args.includeNumbers) validChars += numbers;
    if (args.includeSymbols) validChars += symbols;
    if (args.includeUppercase) validChars += uppercase;

    let password = "";
    for (let i = 0; i < args.length; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      password += validChars[randomIndex];
    }

    return password;
  },
});

export const savePassword = mutation({
  args: {
    password: v.string(),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.insert("savedPasswords", {
      userId,
      password: args.password,
      label: args.label,
    });
  },
});

export const getSavedPasswords = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("savedPasswords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
