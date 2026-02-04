"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, MapPin } from "lucide-react"
import { getAutoCompleteLocations } from "@/app/actions/properties"

export function Filters({ onApply }: { onApply?: () => void }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // State for filters
    const [location, setLocation] = useState(searchParams.get("location") || "")
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
    const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.get("type")?.split(",") || [])
    const [bhkTypes, setBhkTypes] = useState<string[]>(searchParams.get("bhk")?.split(",") || [])
    const [amenities, setAmenities] = useState<string[]>(searchParams.get("amenities")?.split(",") || [])

    // Suggestion state
    const [suggestions, setSuggestions] = useState<{ locality: string; city: string; count: number }[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Handle auto-complete
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (location.length >= 2) {
                const results = await getAutoCompleteLocations(location)
                setSuggestions(results)
                setShowSuggestions(true)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }

        // Debounce
        const timeoutId = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeoutId)
    }, [location])

    const handleApplyFilters = () => {
        const params = new URLSearchParams()
        if (location) params.set("location", location)
        if (minPrice) params.set("minPrice", minPrice)
        if (maxPrice) params.set("maxPrice", maxPrice)
        if (propertyTypes.length) params.set("type", propertyTypes.join(","))
        if (bhkTypes.length) params.set("bhk", bhkTypes.join(","))
        if (amenities.length) params.set("amenities", amenities.join(","))

        router.push(`/search?${params.toString()}`)

        // Close mobile drawer if callback provided
        if (onApply) {
            onApply()
        }
    }

    const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item))
        } else {
            setList([...list, item])
        }
    }

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 h-fit sticky top-24 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={() => router.push('/search')} className="text-slate-400 hover:text-slate-900 h-auto p-0 hover:bg-transparent font-normal text-xs">
                    Clear all
                </Button>
            </div>

            <div className="space-y-6">
                {/* Location Search */}
                <div className="space-y-2 relative">
                    <Label>Location</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search locality..."
                            className="pl-9 rounded-xl bg-slate-50"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    {/* Auto-suggest dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 p-2 max-h-60 overflow-y-auto">
                            {suggestions.map((s, i) => (
                                <div
                                    key={i}
                                    className="p-2 hover:bg-slate-50 cursor-pointer rounded-lg text-sm text-slate-700 flex justify-between"
                                    onClick={() => {
                                        setLocation(s.locality)
                                        setShowSuggestions(false)
                                    }}
                                >
                                    <span>{s.locality}, {s.city}</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                    <Label>Property Type</Label>
                    <div className="space-y-2">
                        {["Apartment", "Villa", "Independent House", "Plot", "Office"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`type-${type}`}
                                    checked={propertyTypes.includes(type)}
                                    onCheckedChange={() => toggleFilter(propertyTypes, setPropertyTypes, type)}
                                />
                                <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">{type}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                    <Label>Budget (₹)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Min"
                            type="number"
                            className="rounded-xl bg-slate-50"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <Input
                            placeholder="Max"
                            type="number"
                            className="rounded-xl bg-slate-50"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                {/* BHK */}
                <div className="space-y-3">
                    <Label>BHK</Label>
                    <div className="flex flex-wrap gap-2">
                        {["1 RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((bhk) => (
                            <Button
                                key={bhk}
                                variant={bhkTypes.includes(bhk) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleFilter(bhkTypes, setBhkTypes, bhk)}
                                className={`rounded-full ${bhkTypes.includes(bhk) ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-slate-200'}`}
                            >
                                {bhk}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                    <Label>Amenities</Label>
                    <div className="space-y-2">
                        {["Gym", "Pool", "Parking", "Security", "Club House"].map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`amenity-${item}`}
                                    checked={amenities.includes(item)}
                                    onCheckedChange={() => toggleFilter(amenities, setAmenities, item)}
                                />
                                <Label htmlFor={`amenity-${item}`} className="font-normal cursor-pointer">{item}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button onClick={handleApplyFilters} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                    Apply Filters
                </Button>
            </div>
        </div>
    )
}
