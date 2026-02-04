import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAgentProperties } from "@/app/actions/dashboard"
import Link from "next/link"
import { Plus, Building, Edit, Eye, Trash2 } from "lucide-react"
import type { Property } from "@/app/actions/properties"
import Image from "next/image"

export default async function MyPropertiesPage() {
    const properties = await getAgentProperties()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Properties</h2>
                    <p className="text-slate-500">Manage your listings and view their performance.</p>
                </div>
                <Link href="/post-property">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Plus className="w-4 h-4 mr-2" /> Add New Property
                    </Button>
                </Link>
            </div>

            {properties.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Building className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No properties posted yet</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Create your first listing to start getting leads.</p>
                        <Link href="/post-property">
                            <Button variant="outline">List a Property</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {properties.map((property: Property) => (
                        <Card key={property.id} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-48 h-32 md:h-auto bg-slate-100 relative shrink-0">
                                    {property.media?.photos?.[0] ? (
                                        <Image src={property.media.photos[0]} alt="Property" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                        ${property.verified ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}
                                   `}>
                                        {property.verified ? 'Verified' : 'Pending'}
                                    </div>
                                </div>

                                <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900">
                                                {property.address_details?.locality || "Untitled Property"}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {property.bhk} {property.property_type} • ₹ {property.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8">
                                                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <Eye className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium">0</span> Views
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">L</span>
                                            <span className="font-medium">0</span> Leads
                                        </div>

                                        <div className="ml-auto">
                                            <Link href={`/property/${property.id}`} className="text-sm font-medium text-indigo-600 hover:underline">
                                                View Live
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
