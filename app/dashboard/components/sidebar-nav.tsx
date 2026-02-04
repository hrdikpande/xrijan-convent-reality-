"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import {
    User,
    Heart,
    Search,
    Calendar,
    MessageSquare,
    Bell,
    FileText,
    LayoutDashboard,
    Building,
    Users,
    TrendingUp,
    CreditCard,
    ShieldCheck
} from "lucide-react"

// Types of navigation items
type NavItem = {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

const buyerItems: NavItem[] = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Profile", href: "/dashboard/profile", icon: User },
    { title: "Saved Properties", href: "/dashboard/saved-properties", icon: Heart },
    { title: "Saved Searches", href: "/dashboard/saved-searches", icon: Search },
    { title: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { title: "Chats", href: "/dashboard/chats", icon: MessageSquare },
    { title: "Alerts", href: "/dashboard/alerts", icon: Bell },
    // Buyers can upgrade/modify account which includes KYC in a sense, but mostly for Agents
]

const agentItems: NavItem[] = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Profile", href: "/dashboard/profile", icon: User },
    { title: "My Properties", href: "/dashboard/properties", icon: Building },
    { title: "Leads & CRM", href: "/dashboard/leads", icon: Users }, // Shared route name but different content possibly, or different route
    { title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { title: "Chats", href: "/dashboard/chats", icon: MessageSquare },
    { title: "Verification", href: "/dashboard/kyc", icon: ShieldCheck },
]

const builderItems: NavItem[] = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Projects", href: "/dashboard/projects", icon: Building }, // Using Building icon for projects
    { title: "Inventory", href: "/dashboard/inventory", icon: FileText },
    { title: "Team", href: "/dashboard/team", icon: Users },
    { title: "Leads", href: "/dashboard/leads", icon: Users }, // Reusing Users icon or similar
    { title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { title: "Verification", href: "/dashboard/kyc", icon: ShieldCheck },
]

const adminItems: NavItem[] = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Sales CRM", href: "/dashboard/admin/sales", icon: Users },
    { title: "Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Properties", href: "/dashboard/admin/properties", icon: Building },
    { title: "Finance", href: "/dashboard/admin/finance", icon: CreditCard },
    { title: "Analytics", href: "/dashboard/admin/analytics", icon: TrendingUp },
]

export function SidebarNav({ role }: { role?: string }) {
    const pathname = usePathname()

    // Roles: 'buyer', 'tenant', 'owner', 'agent', 'builder', 'admin'
    let items = buyerItems

    if (role === 'builder') {
        items = builderItems
    } else if (role === 'admin') {
        items = adminItems
    } else if (['agent', 'owner'].includes(role || '')) {
        items = agentItems
    }

    return (
        <nav className="grid items-start gap-2">
            {items.map((item) => {
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 transition-all duration-200",
                            pathname === item.href ? "bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500"
                        )}
                    >
                        <Icon className={cn("w-4 h-4 transition-colors", pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                        <span>{item.title}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
