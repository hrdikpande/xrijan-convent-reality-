import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTeamMembers } from "@/app/actions/dashboard"
import { Users, UserPlus, Phone } from "lucide-react"

interface TeamMember {
    id: string | number;
    name: string;
    role: string;
    email: string;
    phone?: string;
}

export default async function TeamPage() {
    const team = await getTeamMembers()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h2>
                    <p className="text-slate-500">Manage sales representatives and assign roles.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    <UserPlus className="w-4 h-4 mr-2" /> Add Member
                </Button>
            </div>

            {team.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No team members</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Invite your sales team to collaborate on leads.</p>
                        <Button variant="outline">Send Invite</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member: TeamMember) => (
                        <Card key={member.id} className="border-slate-200/60 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                        {member.name.charAt(0)}
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-600`}>
                                        {member.role.replace('_', ' ')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900">{member.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">{member.email}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-slate-600 gap-2">
                                        <Phone className="w-3.5 h-3.5" /> {member.phone || "No phone"}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">Remove</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
