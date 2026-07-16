import { buttonVariants } from "@/components/ui/button"
import CommentSection from "@/components/web/CommentSection"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { ArrowLeft } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ postId: Id<'posts'> }> }): Promise<Metadata> {
    const { postId } = await params
    const post = await fetchQuery(api.posts.getPostById, { postId: postId })

    if (!post) {
        return {
            title: 'Post not found'
        }
    }

    return {
        title: post.title,
        description: post.body
    }
}

async function PostDetails({ params }: { params: Promise<{ postId: Id<'posts'> }> }) {
    const { postId } = await params

    const [post, preloadedComments] = await Promise.all([
        await fetchQuery(api.posts.getPostById, { postId: postId }),
        await preloadQuery(api.comments.getCommentsByPost, {
            postId
        })
    ])

    if (!post) {
        return (
            <div>
                <h1 className="text-6xl font-extrabold text-red-500 py-20">No post found</h1>
            </div>
        )
    }
    return (
        <div className="max-w-3xl mx-auto py-8 animate-in fade-in duration-500 relative">
            <Link className={buttonVariants({ variant: 'secondary' })} href="/blog">
                <HugeiconsIcon icon={ArrowLeft} className="size-4" />
                Back to blog
            </Link>

            <div className="mt-2 relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
                <Image src="/images.jpg" fill alt={post.title} />
            </div>

            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
                <p className="text-sm text-muted-foreground">Posted on: {new Date(post._creationTime).toLocaleDateString('en-us')}</p>
            </div>

            <hr className="my-8" />

            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.body}</p>

            <hr className="my-8" />

            <CommentSection preloadedComments={preloadedComments} />
        </div>
    )
}

export default PostDetails
