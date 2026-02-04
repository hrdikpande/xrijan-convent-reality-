export type PropertyDetailsData = {
    listingType?: "Sell" | "Rent"
    category?: "Residential" | "Commercial"
    type?: string
    bhk?: string
    area?: string
    price?: string
    city?: string
    locality?: string
    landmark?: string
}

export type PropertyMediaData = {
    photos?: string[]
    floor_plans?: string[]
}

export type ContactPrefsData = {
    call?: boolean
    whatsapp?: boolean
    chat?: boolean
}

export type PostPropertyFormData = {
    role: string
    details: PropertyDetailsData
    media: PropertyMediaData
    amenities: string[]
    contact: ContactPrefsData
}
