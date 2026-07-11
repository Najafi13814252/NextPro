import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { ReactNode } from "react"

function AuthLayout({children}: {children: ReactNode}) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="absolute top-5 left-5">
                <Link href="/" className={buttonVariants({variant: "secondary"})}>
                    <HugeiconsIcon icon={ArrowLeft} className="size-4" />
                    Go Back
                </Link>
            </div>

            <div className="w-full max-w-md mx-auto">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout
