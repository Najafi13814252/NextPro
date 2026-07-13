import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";

// Create a new post with the given title and body
export const createPost= mutation({
    args: { 
        title: v.string(),
        body: v.string()
     },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)

        if(!user) {
            throw new ConvexError('Not athenticated!')
        }

        const blogArticle = await ctx.db.insert("posts", { 
            title: args.title,
            body: args.body,
            authorId: user._id
         });
        return blogArticle;
    },
});