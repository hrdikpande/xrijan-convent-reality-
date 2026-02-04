"use client"

import { useState } from "react"
import { Search, MapPin, Building2, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export function HomeSearch({ userRole }: { userRole?: string | null }) {
    const [activeTab, setActiveTab] = useState("buy")
    const showPostProperty = userRole && !['buyer', 'tenant'].includes(userRole)

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-indigo-500/10 border border-white/50 relative overflow-hidden">

                {/* Decorative glows */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <Tabs defaultValue="buy" onValueChange={setActiveTab} className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                        {/* Mobile: Scrollable tabs */}
                        <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                            <TabsList className="bg-slate-100/80 p-1 rounded-full border border-slate-200 inline-flex w-max">
                                {["buy", "rent", "pg", "plot", "commercial"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all capitalize whitespace-nowrap"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {showPostProperty && (
                            <Link href="/post-property" className="w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto rounded-full border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base h-9 sm:h-10">
                                    <span className="hidden sm:inline">Post Property</span>
                                    <span className="sm:hidden">Post</span>
                                    <span className="ml-2 bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full">FREE</span>
                                </Button>
                            </Link>
                        )}
                    </div>

                    <TabsContent value={activeTab} className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3">
                            {/* Location Input */}
                            <div className="md:col-span-4 relative group">
                                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <Input
                                    placeholder="Location"
                                    className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400 text-sm sm:text-base"
                                />
                            </div>

                            {/* Property Type Select */}
                            <div className="md:col-span-3">
                                <Select>
                                    <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-500/10 pl-3 sm:pl-4 text-sm sm:text-base font-medium text-slate-600">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                            <SelectValue placeholder="Type" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="apartment">Apartment</SelectItem>
                                        <SelectItem value="villa">Villa</SelectItem>
                                        <SelectItem value="office">Office Space</SelectItem>
                                        <SelectItem value="plot">Land / Plot</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Budget Select */}
                            <div className="md:col-span-3">
                                <Select>
                                    <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-500/10 pl-3 sm:pl-4 text-sm sm:text-base font-medium text-slate-600">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                            <SelectValue placeholder="Budget" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Under ₹50 Lac</SelectItem>
                                        <SelectItem value="mid">₹50 Lac - ₹1 Cr</SelectItem>
                                        <SelectItem value="high">₹1 Cr - ₹5 Cr</SelectItem>
                                        <SelectItem value="luxury">Above ₹5 Cr</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search Button */}
                            <div className="md:col-span-2">
                                <Link href="/search">
                                    <Button className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 text-sm sm:text-base font-semibold group transition-all hover:scale-[1.02]">
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Search
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
