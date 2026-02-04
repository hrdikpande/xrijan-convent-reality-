import { Gallery } from "@/components/property/gallery"
import { BookingCard } from "@/components/property/booking-card"
import { AmenitiesList } from "@/components/property/amenities-list"
import { EmiCalculator } from "@/components/property/emi-calculator"
import { SimilarProperties } from "@/components/property/similar-properties"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, BedDouble, Bath, Square, Clock, Building, Home } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !property) {
        console.error(error)
        notFound()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const address = property.address_details as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const specs = property.specs as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const media = property.media as any

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 pt-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{property.listing_type}</Badge>
                        <Badge variant="outline" className="text-slate-500 border-slate-200">{property.property_type}</Badge>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                {property.bhk} {property.property_type} in {address?.locality}
                            </h1>
                            <div className="flex items-center text-slate-500 font-medium">
                                <MapPin className="w-5 h-5 mr-1 text-slate-400" />
                                <span>{address?.locality}, {address?.city}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-indigo-600">₹{(property.price / 100000).toFixed(2)} Lac</span>
                            <span className="text-sm text-slate-500">₹{Math.round(property.price / property.area_sqft)} / sqft</span>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <Gallery images={media?.photos || []} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Key Specs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center text-slate-400 text-sm gap-2">
                                    <BedDouble className="w-4 h-4" /> Bedrooms
                                </span>
                                <span className="font-semibold text-lg text-slate-900">{property.bhk}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center text-slate-400 text-sm gap-2">
                                    <Bath className="w-4 h-4" /> Bathrooms
                                </span>
                                {/* Mocking baths as it wasn't in top level schema initially, or use specs */}
                                <span className="font-semibold text-lg text-slate-900">2 Baths</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center text-slate-400 text-sm gap-2">
                                    <Square className="w-4 h-4" /> Area
                                </span>
                                <span className="font-semibold text-lg text-slate-900">{property.area_sqft} sqft</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center text-slate-400 text-sm gap-2">
                                    <Clock className="w-4 h-4" /> Possession
                                </span>
                                <span className="font-semibold text-lg text-slate-900">{specs?.possession_status || "Ready"}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">About this property</h2>
                            <div className="prose text-slate-600 leading-relaxed max-w-none">
                                <p className="mb-4">
                                    Check out this amazing {property.bhk} {property.property_type} located in the heart of {address?.city}.
                                    With a built-up area of {property.area_sqft} sqft, it offers ample space and comfort.
                                    This property is {specs?.furnishing || "Semi-Furnished"} and is {specs?.possession_status?.toLowerCase()}.
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Amenities */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Amenities</h2>
                            <AmenitiesList amenities={property.amenities || []} />
                        </div>

                        <Separator />

                        {/* Project / Builder Info */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Project Highlights</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">RERA Registered</h4>
                                        <p className="text-sm text-slate-500">P51800001234</p>
                                        <Button variant="link" className="p-0 h-auto text-indigo-600 text-xs mt-1">View Certificate</Button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Developed by {property.poster_role}</h4>
                                        <p className="text-sm text-slate-500">4.8/5 Rating (Verified)</p>
                                        <Button variant="link" className="p-0 h-auto text-indigo-600 text-xs mt-1">View Profile</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* EMI Calculator */}
                        <EmiCalculator price={property.price} />

                        <Separator />

                        {/* Location / Map */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Location</h2>
                            <div className="rounded-3xl overflow-hidden h-[400px] bg-slate-100 relative group">
                                <div className="absolute inset-0 bg-[url('/map-placeholder.png')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button className="bg-white text-slate-900 hover:bg-slate-50 shadow-xl font-semibold">
                                        <MapPin className="w-4 h-4 mr-2 text-red-500" /> View on Map
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                                {["Schools", "Hospitals", "Restaurants", "Transport"].map(item => (
                                    <Button key={item} variant="outline" className="rounded-full border-slate-200">
                                        {item}
                                    </Button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <BookingCard price={property.price} />
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <Separator className="mb-12" />
                    <SimilarProperties />
                </div>
            </div>
        </div>
    )
}
