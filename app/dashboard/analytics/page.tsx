import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/app/actions/dashboard"
import { BarChart3, TrendingUp, Users, MousePointerClick } from "lucide-react"

export default async function AnalyticsPage() {
    const stats = await getAnalytics()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Performance Analytics</h2>
                <p className="text-slate-500">Insights into your listings and lead generation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Views</CardTitle>
                        <BarChart3 className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalViews}</div>
                        <p className="text-xs text-slate-500 mt-1 space-x-1">
                            <span className="text-emerald-600 font-medium flex items-center inline-flex">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12%
                            </span>
                            <span>from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalLeads}</div>
                        <p className="text-xs text-slate-500 mt-1 space-x-1">
                            <span className="text-emerald-600 font-medium flex items-center inline-flex">
                                <TrendingUp className="w-3 h-3 mr-1" /> +4%
                            </span>
                            <span>from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Conversion Rate</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">3.6%</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Based on views vs leads
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200/60 shadow-sm min-h-[300px] flex items-center justify-center bg-slate-50/50">
                <div className="text-center">
                    <p className="text-slate-400 font-medium">Detailed charts coming soon</p>
                    <p className="text-xs text-slate-400">Visualizing traffic sources and engagement trends</p>
                </div>
            </Card>
        </div>
    )
}
