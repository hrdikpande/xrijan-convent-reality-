import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function PostPropertyLayout({
    children,
}: {
    children: ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login?next=/post-property")
    }

    return children
}
