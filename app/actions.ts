'use server'

import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { postSchema } from "@/schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
import z from "zod";

export async function CreateBlogAction(values: z.infer<typeof postSchema>) {
    const parsed = postSchema.safeParse(values)

    if (!parsed.success) {
        throw new Error('Something went wrong!')
    }

    const token = await getToken()

    await fetchMutation(api.posts.createPost, {
        title: parsed.data.title,
        body: parsed.data.content
    }, {token})

    return redirect('/')
}