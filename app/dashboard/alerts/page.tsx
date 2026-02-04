import { Card, CardContent } from "@/components/ui/card"
import { Bell } from "lucide-react"

export default function AlertsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h2>
                <p className="text-slate-500">Stay updated with alerts and notifications.</p>
            </div>

            <Card className="border-slate-200/60 shadow-sm border-dashed min-h-[400px]">
                <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No new notifications</h3>
                    <p className="text-slate-500 max-w-sm mt-1">We&apos;ll let you know when something important happens.</p>
                </CardContent>
            </Card>
        </div>
    )
}
