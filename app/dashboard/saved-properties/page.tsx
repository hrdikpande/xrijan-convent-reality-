import { Card, CardContent } from "@/components/ui/card"
import { getSavedProperties } from "@/app/actions/dashboard"
import Link from "next/link"
import { Bed, Bath, Move, MapPin } from "lucide-react"
import type { Property } from "@/app/actions/properties"
import Image from "next/image"

interface SavedProperty {
    id: string | number;
    property: Property & {
        specs?: { bhk?: string };
    };
}

export default async function SavedPropertiesPage() {
    const savedProperties = await getSavedProperties()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Saved Properties</h2>
                <p className="text-slate-500">View and manage the properties you have saved.</p>
            </div>

            {savedProperties.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <span className="text-2xl">❤️</span>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No saved properties yet</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">Start exploring properties and save the ones you love to keep track of them here.</p>
                        <Link href="/search" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors">
                            Explore Properties
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((item: SavedProperty) => {
                        const property = item.property
                        return (
                            <Link key={item.id} href={`/property/${property.id}`} className="group block">
                                <Card className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-[4/3] bg-slate-100 relative">
                                        {property.media?.photos?.[0] ? (
                                            <Image
                                                src={property.media.photos[0]}
                                                alt="Property"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-medium text-slate-900 shadow-sm">
                                            Saved
                                        </div>
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-slate-900 truncate">
                                                {property.address_details?.locality || "Unknown Location"}, {property.address_details?.city}
                                            </h3>
                                            <div className="flex items-center text-slate-500 text-sm gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate">{property.address_details?.city || "City"}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Bed className="w-4 h-4 text-slate-400" />
                                                <span>{property.specs?.bhk || "-"} BHK</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="w-4 h-4 text-slate-400" />
                                                <span>- Bath</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Move className="w-4 h-4 text-slate-400" />
                                                <span>{property.area_sqft} sqft</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                            <span className="font-bold text-indigo-600">
                                                ₹ {property.price?.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">View Details</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
