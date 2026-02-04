"use server"

import { createClient } from "@/utils/supabase/server"

export type Property = {
    id: string | number
    media: { photos: string[] }
    price: number
    bhk: string
    property_type: string
    listing_type: string
    address_details: { locality: string; city: string }
    area_sqft: number
    verified?: boolean
}

export type SearchFilters = {
    minPrice?: number
    maxPrice?: number
    minArea?: number
    maxArea?: number
    propertyTypes?: string[]
    bhkTypes?: string[]
    amenities?: string[]
    listingType?: string // 'Sell' or 'Rent'
    location?: string
    limit?: number
    offset?: number
}

export async function searchProperties(filters: SearchFilters): Promise<Property[]> {
    const supabase = await createClient()

    const { data: properties, error } = await supabase.rpc('search_properties', {
        min_price: filters.minPrice || null,
        max_price: filters.maxPrice || null,
        min_area: filters.minArea || null,
        max_area: filters.maxArea || null,
        property_types: filters.propertyTypes && filters.propertyTypes.length > 0 ? filters.propertyTypes : null,
        bhk_types: filters.bhkTypes && filters.bhkTypes.length > 0 ? filters.bhkTypes : null,
        selected_amenities: filters.amenities && filters.amenities.length > 0 ? filters.amenities : null,
        listing_status: filters.listingType || null,
        search_location: filters.location || null,
        limit_val: filters.limit || 20,
        offset_val: filters.offset || 0
    })

    if (error) {
        console.error("Search RPC Error:", error)
        return []
    }

    return properties || []
}

export async function getAutoCompleteLocations(query: string) {
    const supabase = await createClient()

    if (!query || query.length < 2) return []

    const { data, error } = await supabase.rpc('get_auto_complete_locations', {
        search_term: query
    })

    if (error) {
        console.error("Auto-complete Error:", error)
        return []
    }

    return data || []
}

export async function getTrendingLocalities() {
    // For now, return a static list or fetch most popular from stats table
    // Ideally this queries `property_stats` aggregated by locality
    return [
        { name: "Indiranagar", city: "Bangalore", count: 124 },
        { name: "HSR Layout", city: "Bangalore", count: 98 },
        { name: "Whitefield", city: "Bangalore", count: 86 },
        { name: "Koramangala", city: "Bangalore", count: 72 },
    ]
}
