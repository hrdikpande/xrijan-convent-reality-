import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Management</h2>
                    <p className="text-slate-500">Track availability and pricing for all units.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Bulk Update</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Add Units</Button>
                </div>
            </div>

            <Card className="border-slate-200/60 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <LayoutGrid className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Inventory Empty</h3>
                    <p className="text-slate-500 max-w-sm mt-1 mb-6">Select a project to start adding units to your inventory.</p>
                    <Button variant="outline">Select Project</Button>
                </CardContent>
            </Card>
        </div>
    )
}
