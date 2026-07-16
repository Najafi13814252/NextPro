'use client'

import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Loader, MessageSquare } from "@hugeicons/core-free-icons"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { commentSchema } from "@/schemas/comment"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import z from "zod"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"

function CommentSection(props: {preloadedComments: Preloaded<typeof api.comments.getCommentsByPost>}) {
    const params = useParams<{ postId: Id<'posts'> }>()

    const comments = usePreloadedQuery(props.preloadedComments)

    const [isPending, startTransition] = useTransition()

    const mutation = useMutation(api.comments.createComment)

    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.postId
        }
    })

    const onSubmit = async (data: z.infer<typeof commentSchema>) => {
        startTransition(async () => {
            try {
                await mutation(data)
                form.reset()
                toast.success('Comment posted')
            } catch {
                toast.error('Failed to create post')
            }
        })
    }

    if (comments === undefined) {
        return <p>Loading...</p>
    }
    return (
        <Card>
            <CardHeader className="flex items-center gap-2 border-b">
                <HugeiconsIcon icon={MessageSquare} className="size-5" />
                <h2 className="text-xl font-bold">{comments?.length} Comments</h2>
            </CardHeader>
            <CardContent className="space-y-8">

                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller name="body" control={form.control} render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Comment</FieldLabel>
                                <Textarea aria-invalid={fieldState.invalid} placeholder="Share your thoughts" {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />
                    </FieldGroup>

                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <HugeiconsIcon icon={Loader} className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <span>Comment</span>
                        )}
                    </Button>
                </form>

                {comments?.length > 0 && <Separator />}

                <section className="space-y-6">
                    {comments?.map(comment => (
                        <div key={comment._id} className="flex gap-4">
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}`} alt={comment.authorName} />
                                <AvatarFallback>
                                    {comment.authorName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm">{comment.authorName}</p>
                                    <div className="text-muted-foreground text-xs divide-x flex">
                                        <p className="pr-2">{new Date(comment._creationTime).toLocaleDateString('en-us')}</p>
                                        <p className="pl-2">{new Date(comment._creationTime).toLocaleTimeString('en-us')}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </CardContent>
        </Card>
    )
}

export default CommentSection
