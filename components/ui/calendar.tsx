"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

export function Calendar() {
    // Simplified visual calendar for the booking UI
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    const dates = Array.from({ length: 31 }, (_, i) => i + 1)
    const [selectedDate, setSelectedDate] = React.useState<number | null>(12)

    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-sm">October 2026</span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {days.map(day => (
                    <div key={day} className="text-[10px] text-slate-400 font-medium uppercase">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array(2).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {dates.map((date) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                            "h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all",
                            selectedDate === date
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                                : "hover:bg-slate-100 text-slate-700"
                        )}
                    >
                        {date}
                    </button>
                ))}
            </div>
        </div>
    )
}
