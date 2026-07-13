'use client'

import { CreateBlogAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { api } from "@/convex/_generated/api"
import { postSchema } from "@/schemas/blog"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
// import { useMutation } from "convex/react"
// import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

function CreatePage() {
    const [isPending, startTransition] = useTransition()

    // const router = useRouter()

    // const mutation = useMutation(api.posts.createPost)

    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    const onSubmit = (values: z.infer<typeof postSchema>) => {
        startTransition(async () => {
            // mutation({
            //     title: values.title,
            //     body: values.content
            // })


            await CreateBlogAction(values)

            toast.success('Everything was fine')
            // router.push('/')
        })
    }

    return (
        <div className="py-12 ">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="text-xl text-muted-foreground pt-4">Create your own blog article...</p>
            </div>

            <Card className="w-full max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Create Blog Article</CardTitle>
                    <CardDescription>Create a new blog article</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="Title" {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />

                            <Controller name="content" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Content</FieldLabel>
                                    <Textarea aria-invalid={fieldState.invalid} placeholder="Content..."  {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />

                            <Button type="submit" className="w-full mt-6" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <HugeiconsIcon icon={Loader} className="size-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <span>Create Post</span>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreatePage
