"use client"

import { Filters } from "@/components/property-search/filters"
import { PropertyCard } from "@/components/property-search/property-card"
import { Button } from "@/components/ui/button"
import { searchProperties, type Property } from "@/app/actions/properties"
import { Search, SlidersHorizontal, X, Bookmark } from "lucide-react"
import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"

function SearchPageContent() {
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Parse filters from URL
    const filters = useMemo(() => ({
        location: searchParams.get('location') || undefined,
        listingType: searchParams.get('listingType') || undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        propertyTypes: searchParams.get('type')?.split(','),
        bhkTypes: searchParams.get('bhk')?.split(','),
        amenities: searchParams.get('amenities')?.split(','),
    }), [searchParams])

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true)
            const results = await searchProperties(filters)
            setProperties(results)
            setIsLoading(false)
        }
        fetchProperties()
    }, [filters])

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 pt-16 sm:pt-20">
            {/* Search Header - Mobile Optimized */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 truncate">
                            {filters.location ? `Properties in ${filters.location}` : `All Properties`}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            {isLoading ? 'Loading...' : `${properties.length} result${properties.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Mobile Filter Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="lg:hidden flex items-center gap-2 h-9 text-sm rounded-xl"
                            onClick={() => setShowFilters(true)}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </Button>

                        {/* Save Search - Hidden on mobile, shown on desktop */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden md:flex items-center gap-2 h-9 rounded-xl"
                        >
                            <Bookmark className="w-4 h-4" />
                            Save Search
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <Filters />
                    </div>

                    {/* Property Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {properties?.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    image={property.media?.photos?.[0] || "/placeholder-house.jpg"}
                                    price={`₹${(property.price / 100000).toFixed(2)} Lac`}
                                    title={`${property.bhk} ${property.property_type} for ${property.listing_type}`}
                                    location={`${property.address_details?.locality}, ${property.address_details?.city}`}
                                    beds={parseInt(property.bhk) || 0}
                                    baths={2}
                                    sqft={property.area_sqft}
                                    type={property.property_type}
                                    status={property.listing_type as "Sale" | "Rent"}
                                    verified={true}
                                />
                            ))}
                            {(!properties || properties.length === 0) && !isLoading && (
                                <div className="col-span-full py-12 sm:py-20 text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-slate-900">No properties found</h3>
                                    <p className="text-sm sm:text-base text-slate-500 mt-1 px-4">Try adjusting your filters or search for a different locality.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                        onClick={() => setShowFilters(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 lg:hidden shadow-2xl overflow-y-auto">
                        {/* Drawer Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="px-4 sm:px-6 py-6">
                            <Filters onApply={() => setShowFilters(false)} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading properties...</p>
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    )
}
