import Link from "next/link"
import { buttonVariants } from "../ui/button"
import ThemeToggle from "./ThemeToggle"

function Navbar() {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-green-500">Pro</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className={buttonVariants({variant: "ghost"})}>Home</Link>
          <Link href="/blog" className={buttonVariants({variant: "ghost"})}>Blog</Link>
          <Link href="/create" className={buttonVariants({variant: "ghost"})}>Create</Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/auth/sign-up" className={buttonVariants({variant: "default"})}>Sign up</Link>
        <Link href="/auth/login" className={buttonVariants({variant: "secondary"})}>Login</Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar
