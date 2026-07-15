'use client'

import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import ThemeToggle from "./ThemeToggle"
import { useConvexAuth } from "convex/react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Skeleton } from "../ui/skeleton"

function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth()

  const router = useRouter()

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully!")
          router.push('/')
        },
        onError: (error) => {
          toast.error(error.error.message)
        }
      }
    })
}
return (
  <nav className="w-full py-5 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <Link href="/">
        <h1 className="text-3xl font-bold">
          Next<span className="text-blue-800">Pro</span>
        </h1>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>Home</Link>
        <Link href="/blog" className={buttonVariants({ variant: "ghost" })}>Blog</Link>
        <Link href="/create" className={buttonVariants({ variant: "ghost" })}>Create</Link>
      </div>
    </div>

    <div className="flex items-center gap-2">

      {isLoading ? <Skeleton className="w-32 h-9"/> : isAuthenticated ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <>
          <Link href="/auth/sign-up" className={buttonVariants({ variant: "default" })}>Sign up</Link>
          <Link href="/auth/login" className={buttonVariants({ variant: "secondary" })}>Login</Link>
        </>
      )}
      <ThemeToggle />
    </div>
  </nav>
)
}

export default Navbar
