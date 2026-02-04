import { Card, CardContent } from "@/components/ui/card"
import { IndianRupee } from "lucide-react"

export default function CommissionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Commissions</h2>
                <p className="text-slate-500">Track earnings and payouts.</p>
            </div>

            <Card className="border-slate-200/60 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <IndianRupee className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No commissions yet</h3>
                    <p className="text-slate-500 max-w-sm mt-1">Commissions will appear here once subscription sales are logged.</p>
                </CardContent>
            </Card>
        </div>
    )
}
