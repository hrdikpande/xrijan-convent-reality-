import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getInternalLeads } from "@/app/actions/dashboard"
import { Plus, Phone, Mail, Building, User } from "lucide-react"

interface InternalLead {
    id: string | number;
    type: string;
    name: string;
    company_name?: string;
    phone?: string;
    status: string;
}

export default async function SalesLeadsPage() {
    const leads = await getInternalLeads()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Lead Pipeline</h2>
                    <p className="text-slate-500">Manage potential agents and builders.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add New Lead
                </Button>
            </div>

            {leads.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <User className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">Pipeline Empty</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Start by adding agents or builders you are targeting.</p>
                        <Button variant="outline">Import Leads</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {leads.map((lead: InternalLead) => (
                        <Card key={lead.id} className="border-slate-200/60 shadow-sm hover:border-slate-300 transition-colors">
                            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                        ${lead.type === 'agent' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}
                                    `}>
                                        {lead.type === 'agent' ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                                        <p className="text-sm text-slate-500">{lead.company_name || "Independent"} • {lead.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                        ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                            lead.status === 'onboarded' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}
                                     `}>
                                        {lead.status}
                                    </span>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">Log Interaction</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
