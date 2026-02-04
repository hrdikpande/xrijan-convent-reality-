import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPendingProperties } from "@/app/actions/dashboard"
import { Check, X, MapPin } from "lucide-react"
import type { Property } from "@/app/actions/properties"
import Image from "next/image"

type PendingProperty = Property & {
    owner?: {
        full_name?: string;
        email?: string;
    };
};

export default async function ModeratorPage() {
    const properties = await getPendingProperties()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Property Moderation</h2>
                <p className="text-slate-500">Review and approve property listings.</p>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <p>No properties pending review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {properties.map((property: PendingProperty) => (
                        <Card key={property.id} className="border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-64 bg-slate-100 h-48 md:h-auto shrink-0 relative">
                                    {property.media?.photos?.[0] ? (
                                        <Image src={property.media.photos[0]} alt="Property" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                </div>
                                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{property.address_details?.locality || "Unknown Locality"}</h3>
                                                <div className="flex items-center text-sm text-slate-500 gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {property.address_details?.city}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-indigo-600">₹ {property.price?.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500">Posted by: {property.owner?.full_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-sm text-slate-600 mt-4">
                                            <span>{property.bhk} BHK</span>
                                            <span>{property.property_type}</span>
                                            <span>{property.area_sqft} sqft</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                            <Check className="w-4 h-4 mr-2" /> Approve Listing
                                        </Button>
                                        <Button variant="outline" className="flex-1 text-rose-600 hover:bg-rose-50 border-rose-200">
                                            <X className="w-4 h-4 mr-2" /> Reject
                                        </Button>
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
