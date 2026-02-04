"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Share2, MessageCircle, Phone } from "lucide-react"

interface BookingCardProps {
    price?: number
}

export function BookingCard({ price }: BookingCardProps) {
    const displayPrice = price ? `₹${(price / 100000).toFixed(2)} Lac` : "₹1.50 Cr"
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Price</p>
                    <h2 className="text-3xl font-bold text-slate-900">{displayPrice} <span className="text-sm font-normal text-slate-400">/ estimated</span></h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-slate-200">
                        <Heart className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-slate-200">
                        <Share2 className="w-4 h-4 text-slate-600" />
                    </Button>
                </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-slate-900">Book a Site Visit</h3>
                <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50/50">
                    <Calendar />
                </div>
                <div className="flex gap-2">
                    {["10:00 AM", "02:00 PM", "05:00 PM"].map(time => (
                        <Button key={time} variant="outline" size="sm" className="flex-1 rounded-xl border-slate-200 text-xs">{time}</Button>
                    ))}
                </div>
                <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                    Schedule Visit
                </Button>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                        <span className="font-bold text-indigo-700">RK</span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">Rajesh Kumar</p>
                        <Badge variant="premium" className="text-[10px] px-1.5 py-0 h-4 min-w-0">PRO AGENT</Badge>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full bg-white border-indigo-100 hover:bg-indigo-100 text-indigo-700 text-xs h-9">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Chat
                    </Button>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9">
                        <Phone className="w-3.5 h-3.5 mr-1.5" /> Call
                    </Button>
                </div>
            </div>

            <p className="text-xs text-center text-slate-400">
                12 people viewed this property today.
            </p>
        </div>
    )
}
