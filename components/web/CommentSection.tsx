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
import { useMutation } from "convex/react"
import z from "zod"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { useTransition } from "react"

function CommentSection() {
    const params = useParams<{ postId: Id<'posts'> }>()
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
                toast.success('Comment posted')
            } catch {
                toast.error('Failed to create post')
            }
        })
    }
    return (
        <Card>
            <CardHeader className="flex items-center gap-2 border-b">
                <HugeiconsIcon icon={MessageSquare} className="size-5" />
                <h2 className="text-xl font-bold">5 Comments</h2>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller name="body" control={form.control} render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
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
                            <span>Submit</span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default CommentSection
