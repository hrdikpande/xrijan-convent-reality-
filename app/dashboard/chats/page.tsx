import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function ChatsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Messages</h2>
                <p className="text-slate-500">Chat with property owners and agents.</p>
            </div>

            <Card className="border-slate-200/60 shadow-sm border-dashed min-h-[400px]">
                <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No active conversations</h3>
                    <p className="text-slate-500 max-w-sm mt-1">Start a conversation from a property listing to see it here.</p>
                </CardContent>
            </Card>
        </div>
    )
}
