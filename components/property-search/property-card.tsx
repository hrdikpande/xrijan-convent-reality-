"use client"
import Link from "next/link"
import { Heart, MapPin, BedDouble, Bath, Square, MoreHorizontal, Phone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
    id?: number | string
    image: string
    price: string
    title: string
    location: string
    beds: number
    baths: number
    sqft: number
    type: string
    status: "Sale" | "Rent"
    verified?: boolean
    agent?: {
        name: string
        image: string
        verified: boolean
    }
}

export function PropertyCard({
    id = 1, // Defaulting to 1 for now if not passed
    image = "/placeholder-house.jpg",
    price,
    title,
    location,
    beds,
    baths,
    sqft,
    type,
    status,
    verified = false,
    agent
}: PropertyCardProps) {
    return (
        <Link href={`/property/${id}`} className="block group rounded-2xl sm:rounded-3xl bg-white border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative">
            {/* Image Container */}
            <div className="relative h-48 sm:h-64 overflow-hidden">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex gap-1.5 sm:gap-2">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 shadow-sm hover:bg-white">{status}</Badge>
                    {verified && (
                        <Badge variant="success" className="gap-1 shadow-sm">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                        </Badge>
                    )}
                </div>

                <button
                    type="button"
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Heart className="w-4 h-4" />
                </button>

                {/* Since we don't have real images yet, using a colored div for placeholder if image fails, but using Image component as requested */}
                <div className="w-full h-full bg-slate-200 group-hover:scale-105 transition-transform duration-700">
                    {/* In a real app, use next/image here. For now, simulating with a div/gradient or external URL if allowed. 
               Using a placeholder color pattern. */}
                    <div className={`w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 ${image !== "/placeholder-house.jpg" ? "bg-cover bg-center" : ""}`} style={image !== "/placeholder-house.jpg" ? { backgroundImage: `url(${image})` } : {}} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                    <p className="text-xl sm:text-2xl font-bold tracking-tight">{price}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">{type}</p>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{title}</h3>
                    </div>
                </div>

                <div className="flex items-center text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 shrink-0" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                <div className="flex items-center justify-between py-2.5 sm:py-3 border-t border-b border-slate-100 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                        <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                        <span>{beds} <span className="text-slate-400 font-normal hidden sm:inline">Beds</span></span>
                    </div>
                    <div className="w-px h-6 sm:h-8 bg-slate-100" />
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                        <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                        <span>{baths} <span className="text-slate-400 font-normal hidden sm:inline">Baths</span></span>
                    </div>
                    <div className="w-px h-6 sm:h-8 bg-slate-100" />
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                        <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                        <span>{sqft} <span className="text-slate-400 font-normal hidden sm:inline">sqft</span></span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {agent && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                                {/* Placeholder avatar */}
                                <div className="w-full h-full bg-slate-300" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-900">{agent.name}</p>
                                <p className="text-[10px] text-slate-500">Agent</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-1.5 sm:gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 border-slate-200 hover:border-indigo-600 hover:text-indigo-600"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                            size="sm"
                            className="h-8 sm:h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 shadow-md text-xs sm:text-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" /> Contact
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
