"use server"

import { createClient } from "@/utils/supabase/server"

import type { PostPropertyFormData } from "./types"

export async function submitProperty(formData: PostPropertyFormData) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "You must be logged in to post a property." }
    }

    const details = formData?.details || {}

    const area = Number(details.area)
    const price = Number(details.price)
    if (!Number.isFinite(area) || area <= 0) {
        return { error: "Please enter a valid built-up area." }
    }
    if (!Number.isFinite(price) || price <= 0) {
        return { error: "Please enter a valid expected price." }
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("id", user.id)
        .single()

    if (profileError) {
        console.error("Profile Fetch Error:", profileError)
        return { error: "Unable to verify your profile status. Please try again." }
    }

    const isVerified = Boolean(profile?.is_verified)

    const posterRole = (() => {
        const role = String(formData.role || "").toLowerCase()
        if (role === "owner") return "Owner"
        if (role === "agent") return "Agent"
        if (role === "builder") return "Builder"
        return formData.role
    })()

    const statusToUse = isVerified ? "published" : "draft"
    const media = formData?.media && typeof formData.media === "object"
        ? {
            photos: Array.isArray(formData.media.photos) ? formData.media.photos : ["/placeholder-house.jpg"],
            floor_plans: Array.isArray(formData.media.floor_plans) ? formData.media.floor_plans : [],
        }
        : { photos: ["/placeholder-house.jpg"] }

    const { error } = await supabase.from('properties').insert({
        owner_id: user.id,
        poster_role: posterRole,
        listing_type: details.listingType || 'Sell',
        property_category: details.category || 'Residential',
        property_type: details.type || 'Apartment',
        bhk: details.bhk,
        area_sqft: area,
        price: price,
        address_details: {
            city: details.city,
            locality: details.locality,
            landmark: details.landmark
        },
        amenities: formData.amenities,
        contact_prefs: formData.contact,
        // Mocking media for now since we haven't implemented real storage upload in the wizard yet
        media,
        status: statusToUse
    })

    if (error) {
        console.error("Submission Error:", error)
        return { error: error.message }
    }

    return { success: true, status: statusToUse }
}
