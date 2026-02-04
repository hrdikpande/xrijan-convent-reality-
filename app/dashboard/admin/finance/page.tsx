import { Card, CardContent } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export default function FinancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Finance Overview</h2>
                <p className="text-slate-500">Track platform revenue and subscriptions.</p>
            </div>
            <Card className="border-slate-200/60 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Financial Reports</h3>
                    <p className="text-slate-500 max-w-sm mt-1">Detailed revenue, subscription churn, and transaction logs pending.</p>
                </CardContent>
            </Card>
        </div>
    )
}
