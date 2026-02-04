"use client"

import { Button } from "@/components/ui/button"
import { Grid, Map } from "lucide-react"

interface GalleryProps {
    images?: string[]
}

export function Gallery({ }: GalleryProps) {
    // Use first image as main, others as thumbnails. Fallback to placeholder if empty.
    // const mainImage = _images.length > 0 ? _images[0] : "/placeholder-house.jpg"
    // const thumbnails = _images.length > 1 ? _images.slice(1, 4) : ["/placeholder-house.jpg", "/placeholder-house.jpg"]
    return (
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 mb-8 h-[50vh] min-h-[400px]">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-2">
                {/* Main Image */}
                <div className="col-span-2 row-span-2 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-slate-300 animate-pulse" /> {/* Placeholder */}
                    {/* Replace with real Image component */}
                    <div className="absolute inset-0 bg-[url('/placeholder-house.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Secondary Images */}
                <div className="col-span-1 row-span-2 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-slate-200" />
                    <div className="absolute inset-0 bg-[url('/placeholder-house.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="col-span-1 row-span-1 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-slate-300" />
                    <div className="absolute inset-0 bg-[url('/placeholder-house.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="col-span-1 row-span-1 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-slate-200" />
                    <div className="absolute inset-0 bg-[url('/placeholder-house.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg hover:underline">+6 Photos</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-2">
                <Button variant="outline" className="bg-white/90 backdrop-blur-md border-white/20 hover:bg-white text-slate-900 shadow-lg">
                    <Grid className="w-4 h-4 mr-2" /> View Gallery
                </Button>
                <Button variant="outline" className="bg-white/90 backdrop-blur-md border-white/20 hover:bg-white text-slate-900 shadow-lg">
                    <Map className="w-4 h-4 mr-2" /> View on Map
                </Button>
            </div>
        </div>
    )
}
