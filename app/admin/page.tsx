
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Users, FileText } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Overview</h2>
                <p className="text-slate-500 text-lg max-w-2xl">Manage users, verification requests, and system settings from a centralized command center.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-white/60 backdrop-blur-2xl border-white/40 shadow-xl ring-1 ring-white/60 hover:shadow-2xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Pending KYC</CardTitle>
                        <ShieldCheck className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-800">0</div>
                        <p className="text-sm text-indigo-600/80 font-medium mt-1">Requires review</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-2xl border-white/40 shadow-xl ring-1 ring-white/60 hover:shadow-2xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Total Users</CardTitle>
                        <Users className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-800">--</div>
                        <p className="text-sm text-emerald-600/80 font-medium mt-1">Registered on platform</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/40 backdrop-blur-xl border-white/30 shadow-lg ring-1 ring-white/40 opacity-70">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">System Status</CardTitle>
                        <FileText className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-600">Online</div>
                        <p className="text-sm text-slate-500 font-medium mt-1">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="p-12 border border-dashed border-slate-300/50 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white/30 backdrop-blur-sm shadow-inner gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="font-medium text-lg">Additional Admin Modules Coming Soon</p>
                <p className="text-sm text-slate-400 max-w-sm text-center">Future updates will include detailed analytics, user management tables, and content moderation tools.</p>
            </div>
        </div>
    )
}
