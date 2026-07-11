import Navbar from "@/components/web/Navbar"
import { ReactNode } from "react"


function SharedLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />

            {children}
        </>
    )
}

export default SharedLayout
