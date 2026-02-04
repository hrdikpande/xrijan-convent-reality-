"use client"

import { PropertyCard } from "@/components/property-search/property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function SimilarProperties() {
    // Mock data
    const properties = [
        {
            id: 1,
            image: "/placeholder-house.jpg",
            price: "₹1.45 Cr",
            title: "Luxury 3BHK Apartment",
            location: "Near Marine Drive, Mumbai",
            beds: 3,
            baths: 3,
            sqft: 1750,
            type: "Apartment",
            status: "Sale" as const,
            verified: true,
            agent: { name: "Rajesh Kumar", image: "", verified: true }
        },
        {
            id: 2,
            image: "/placeholder-house.jpg",
            price: "₹1.6 Cr",
            title: "Premium Sea View Flat",
            location: "Colaba, Mumbai",
            beds: 3,
            baths: 3,
            sqft: 1900,
            type: "Apartment",
            status: "Sale" as const,
            verified: true,
            agent: { name: "Priya Singh", image: "", verified: true }
        },
        {
            id: 3,
            image: "/placeholder-house.jpg",
            price: "₹1.35 Cr",
            title: "Spacious 3BHK",
            location: "Worli, Mumbai",
            beds: 3,
            baths: 2,
            sqft: 1600,
            type: "Apartment",
            status: "Sale" as const,
            verified: true,
            agent: { name: "Amit Sharma", image: "", verified: false }
        },
    ]

    return (
        <div className="py-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Similar Properties</h3>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                ))}
            </div>
        </div>
    )
}
