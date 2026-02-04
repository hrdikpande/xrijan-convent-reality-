import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInternalLeads } from "@/app/actions/dashboard"
import { BarChart3, Users, IndianRupee } from "lucide-react"

export default async function SalesOverviewPage() {
    const leads = await getInternalLeads()
    const newLeads = leads.filter((l: { status: string }) => l.status === 'new').length
    const onboarded = leads.filter((l: { status: string }) => l.status === 'onboarded').length

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sales Overview</h2>
                <p className="text-slate-500">Track onboarding pipeline and commissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pipeline Value</CardTitle>
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹ 85,000</div>
                        <p className="text-xs text-slate-500 mt-1">Estimated commission</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Leads</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            <span className="text-indigo-600 font-medium">{newLeads} new</span> this week
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Conversion Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {leads.length > 0 ? Math.round((onboarded / leads.length) * 100) : 0}%
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Leads to Onboarded</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-slate-50 rounded-lg p-8 text-center border border-dashed border-slate-300">
                <p className="text-slate-500">More detailed charts and funnel visualization coming soon.</p>
            </div>
        </div>
    )
}
