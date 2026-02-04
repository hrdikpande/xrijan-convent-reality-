import { Button } from "@/components/ui/button"
import { signOut } from "@/app/auth/actions"
import { AnimatedBackground } from "@/components/animated-background"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { SidebarNav } from "./components/sidebar-nav"
import { MobileSidebar } from "./components/mobile-sidebar"
import { getUserProfile } from "@/app/actions/dashboard"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Fetch user profile to get the role
    const profile = await getUserProfile()
    const role = profile?.role || "buyer" // Default to buyer if role is missing

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <AnimatedBackground />

            {/* Header */}
            <header className="border-b border-border/50 p-4 flex justify-between items-center backdrop-blur-xl bg-background/70 sticky top-0 z-50">
                <div className="flex items-center gap-2 md:gap-4">
                    <MobileSidebar role={role} />
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight hidden sm:inline">Convent<span className="text-muted-foreground">Reality</span></span>
                    </Link>
                </div>
                <nav className="flex gap-2 sm:gap-4 items-center">
                    <form action={signOut}>
                        <Button variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm hidden sm:inline-flex">Logout</Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 sm:hidden">
                            <span className="sr-only">Logout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        </Button>
                    </form>
                    <Link
                        href="/dashboard/profile"
                        aria-label="Open profile"
                        className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-2 ring-background shadow-md hover:opacity-90" />
                    </Link>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar - hidden on mobile */}
                    <aside className="hidden md:block md:col-span-3 lg:col-span-2">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl p-4 shadow-sm">
                                <SidebarNav role={role} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-9 lg:col-span-10 relative z-10 min-h-[600px]">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
