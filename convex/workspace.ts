import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        user: v.id('users')
    },
    handler: async (ctx, args) => {
        const workspaceId = await ctx.db.insert('workspace', {
            messages: args.messages,
            user: args.user
        })
        return workspaceId
    }
})

export const GetWorkspace = query({
    args: {
        workspaceId: v.union(v.id('workspace'), v.object({ id: v.id('workspace') }))
    },
    handler: async (ctx, args) => {
        const id = typeof args.workspaceId === 'string' ? args.workspaceId : args.workspaceId.id;
        const result = await ctx.db.get(id);
        return result;
    }
})

export const UpdateMessages = mutation({
    args: {
        workspaceId: v.id('workspace'),
        messages: v.any()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.workspaceId, {
            messages: args.messages
        })
        return result
    }
})

export const UpdateFiles = mutation({
    args: {
        workspaceId: v.union(v.id('workspace'), v.object({ id: v.id('workspace') })),
        files: v.optional(v.any())
    },
    handler: async (ctx, args) => {
        // Extract the ID whether it's a string or object
        const id = typeof args.workspaceId === 'string' ? args.workspaceId : args.workspaceId.id;

        // Validate that the workspace exists before updating
        const workspace = await ctx.db.get(id);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        const result = await ctx.db.patch(id, {
            files: args.files
        });
        return result;
    }
});