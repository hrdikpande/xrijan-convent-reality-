import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function PlatformAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Analytics</h2>
                <p className="text-slate-500">System-wide performance metrics.</p>
            </div>
            <Card className="border-slate-200/60 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <BarChart3 className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Analytics Dashboard</h3>
                    <p className="text-slate-500 max-w-sm mt-1">Traffic, user growth, and lead generation stats pending.</p>
                </CardContent>
            </Card>
        </div>
    )
}
