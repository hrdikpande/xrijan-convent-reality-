
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { ShieldCheck } from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "admin") {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 relative overflow-hidden">
            <AnimatedBackground />

            {/* Premium Admin Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200/50 backdrop-blur-xl bg-white/70 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-black text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h1 className="font-bold text-xl tracking-tight text-slate-900">Admin<span className="text-slate-500 font-normal">Console</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50">{user.email}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 ring-2 ring-white shadow-md"></div>
                    </div>
                </div>
            </header>
            <main className="relative z-10 max-w-7xl mx-auto p-8">
                {children}
            </main>
        </div>
    )
}
