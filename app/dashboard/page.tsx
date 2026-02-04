import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserProfile, getSavedProperties, getBookings } from "@/app/actions/dashboard"
import Link from "next/link"
import { Heart, Calendar, MessageSquare, Bell, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
    const profile = await getUserProfile()
    const savedProperties = await getSavedProperties()
    const bookings = await getBookings()

    // Mock counts for now for features not fully implemented
    const unreadMessages = 0
    const notifications = 0

    const stats = [
        {
            title: "Saved Properties",
            value: savedProperties.length,
            icon: Heart,
            href: "/dashboard/saved-properties",
            color: "text-rose-500",
            bg: "bg-rose-50"
        },
        {
            title: "Upcoming Visits",
            value: bookings.filter((b: { status: string }) => b.status === "confirmed").length,
            icon: Calendar,
            href: "/dashboard/bookings",
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            title: "Unread Messages",
            value: unreadMessages,
            icon: MessageSquare,
            href: "/dashboard/chats",
            color: "text-sky-500",
            bg: "bg-sky-50"
        },
        {
            title: "Notifications",
            value: notifications,
            icon: Bell,
            href: "/dashboard/alerts",
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back, {profile?.full_name?.split(' ')[0] || "User"}
                    <span className="text-2xl ml-2 inline-block animate-wave">👋</span>
                </h2>
                <p className="text-slate-500">Here&apos;s what&apos;s happening with your property search.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link key={stat.title} href={stat.href} className="group">
                            <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:border-slate-300">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                        <p className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity / Next Steps */}
                <Card className="border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <Bell className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {savedProperties.length > 0 || bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.slice(0, 2).map((booking: { id: string | number; booking_date: string }) => (
                                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Property Visit Scheduled</p>
                                            <p className="text-xs text-slate-500">{new Date(booking.booking_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {savedProperties.slice(0, 3).map((item: { id: string | number; property?: { address_details?: { locality: string } } }) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
                                            {/* Image placeholder */}
                                            <div className="w-full h-full bg-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                                                Saved: {item.property?.address_details?.locality || "Property"}
                                            </p>
                                            <p className="text-xs text-slate-500">Just now</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                    <Bell className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="text-sm font-semibold text-slate-900">No activity yet</h4>
                                <p className="text-sm text-slate-500 max-w-[200px] mt-1">
                                    Start browsing properties to see your activity here.
                                </p>
                                <Link href="/search" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm mt-4 inline-flex items-center gap-1 group">
                                    Start searching
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions or Promo */}
                <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full space-y-4">
                        <h3 className="text-2xl font-bold">Find your dream home today.</h3>
                        <p className="text-indigo-100 max-w-sm">Browse thousands of properties with immersive virtual tours and detailed insights.</p>
                        <div className="pt-4">
                            <Link href="/search" className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-indigo-600 shadow transition-colors hover:bg-indigo-50">
                                Search Properties
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
