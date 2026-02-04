import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SavedSearchesPage() {
    // Mock data for now, replace with actual fetch
    const savedSearches: never[] = []

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Saved Searches</h2>
                <p className="text-slate-500">Access your saved search criteria and alerts.</p>
            </div>

            {savedSearches.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No saved searches</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Save your favorite search filters to get notified about new properties.</p>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            Start a New Search
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {/* List of searches would go here */}
                    <p>Searches list...</p>
                </div>
            )}
        </div>
    )
}
