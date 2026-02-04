import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { blockUser, getAllUsers, verifyUser } from "@/app/actions/dashboard"
import { Check, ShieldAlert } from "lucide-react"

interface User {
    id: string | number;
    full_name?: string;
    email?: string;
    role: string;
    is_verified: boolean;
    created_at: string;
}

export default async function UsersPage() {
    const users = await getAllUsers()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h2>
                <p className="text-slate-500">View and manage all registered users.</p>
            </div>

            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user: User) => (
                                <tr key={user.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-3 font-medium text-slate-900">
                                        {user.full_name || user.email?.split("@")[0] || "Unnamed"}
                                        <div className="text-xs text-slate-500 font-normal">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-3 capitalize">{user.role}</td>
                                    <td className="px-6 py-3">
                                        {user.is_verified ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Verified</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3 text-right space-x-2">
                                        {!user.is_verified && (
                                            <form action={verifyUser} className="inline-block">
                                                <input type="hidden" name="userId" value={user.id} />
                                                <Button type="submit" size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:bg-green-50" title="Verify User">
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        )}
                                        <form action={blockUser} className="inline-block">
                                            <input type="hidden" name="userId" value={user.id} />
                                            <Button type="submit" size="icon" variant="outline" className="h-8 w-8 text-rose-600 hover:bg-rose-50" title="Block User">
                                                <ShieldAlert className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
