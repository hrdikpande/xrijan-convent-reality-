import { Card, CardContent } from "@/components/ui/card"
import { getLeads, getUserProfile } from "@/app/actions/dashboard"
import { Phone, Mail, MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

interface Lead {
    id: string | number;
    name: string;
    status: string;
    property?: {
        address_details?: {
            locality?: string;
        };
    };
    source?: string;
    created_at: string;
    phone?: string;
    email?: string;
}

export default async function LeadsPage() {
    const profile = await getUserProfile()
    const role = profile?.role || "buyer"

    if (!['agent', 'owner', 'builder', 'admin'].includes(role)) {
        redirect('/dashboard')
    }

    const leads = await getLeads()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Leads & CRM</h2>
                <p className="text-slate-500">Track and manage your potential clients.</p>
            </div>

            {leads.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Phone className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No leads yet</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Leads from your properties will appear here.</p>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            Add Lead Manually
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {leads.map((lead: Lead) => (
                        <Card key={lead.id} className="border-slate-200/60 shadow-sm hover:border-slate-300 transition-colors">
                            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide 
                                             ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            {lead.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Interested in: <span className="font-medium text-slate-700">{lead.property?.address_details?.locality || "Property"}</span>
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Source: {lead.source} • {new Date(lead.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {lead.phone && (
                                        <Button size="icon" variant="outline" className="h-9 w-9 text-slate-600" title="Call">
                                            <Phone className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {lead.email && (
                                        <Button size="icon" variant="outline" className="h-9 w-9 text-slate-600" title="Email">
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="outline" className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" title="WhatsApp">
                                        <MessageCircle className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-9 w-9 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200" title="Schedule Visit">
                                        <Calendar className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
