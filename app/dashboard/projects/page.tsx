import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/app/actions/dashboard"
import { Plus, Building, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

interface Project {
    id: string | number;
    name: string;
    media?: {
        cover_image?: string;
    };
    status?: string;
    address?: {
        city?: string;
    };
    total_units?: number;
    completion_date?: string;
}

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Projects</h2>
                    <p className="text-slate-500">Manage your construction projects and phases.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add New Project
                </Button>
            </div>

            {projects.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Building className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No projects added</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Create a project to group your units and inventory.</p>
                        <Button variant="outline">Create First Project</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project: Project) => (
                        <Card key={project.id} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 bg-slate-100 relative">
                                {project.media?.cover_image ? (
                                    <Image src={project.media.cover_image} alt={project.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                        <Building className="w-12 h-12 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-white/90 text-slate-900 shadow-sm`}>
                                        {project.status || 'Planned'}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{project.name}</h3>
                                    <div className="flex items-center text-slate-500 text-sm gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{project.address?.city || "Location Pending"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Total Units</p>
                                        <p className="font-medium text-slate-900">{project.total_units || 0}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Completion</p>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <p className="font-medium text-slate-900">{project.completion_date || "TBD"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1">Manage Phases</Button>
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">View Inventory</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
