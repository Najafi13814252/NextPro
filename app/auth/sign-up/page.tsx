'use client'

import { signupSchema } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loader } from "@hugeicons/core-free-icons"

function SignupPage() {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: ""
    }
  })

  function onSubmit(data: z.infer<typeof signupSchema>) {
    startTransition(async () => {
      await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed up  successfully!")
            router.push('/')
          },
          onError: (error) => {
            toast.error(error.error.message)
          }
        }
      })
    })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Create an account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-6">
            <Controller name="name" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="abc" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller name="email" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="abc@gmail.com" type="email" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller name="password" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="****" type="password" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />
          </FieldGroup>

          <Button type="submit" className="w-full mt-6" disabled={isPending}>
            {isPending ? (
              <>
                <HugeiconsIcon icon={Loader} className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Sign up</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignupPage