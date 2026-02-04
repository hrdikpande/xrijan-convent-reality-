"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils/cn"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import type { PropertyDetailsData } from "@/app/post-property/types"

interface StepDetailsProps {
    value: PropertyDetailsData
    onChange: (next: PropertyDetailsData) => void
}

export function StepDetails({ value, onChange }: StepDetailsProps) {
    const update = (key: keyof PropertyDetailsData, nextValue: PropertyDetailsData[keyof PropertyDetailsData]) => {
        onChange({
            ...value,
            [key]: nextValue,
        })
    }

    const listingType = value.listingType ?? "Sell"
    const category = value.category ?? "Residential"

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Property Details</h2>
                <p className="text-sm text-muted-foreground">Tell us about your property</p>
            </div>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Basics</CardTitle>
                    <CardDescription>Start with what you’re listing and its category.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Type Selection */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>I want to</Label>
                            <div className="flex rounded-lg border border-border bg-muted p-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => update("listingType", "Sell")}
                                    className={cn(
                                        "h-9 flex-1 rounded-md",
                                        listingType === "Sell"
                                            ? "bg-background text-foreground shadow-sm hover:bg-background"
                                            : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                                    )}
                                >
                                    Sell
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => update("listingType", "Rent")}
                                    className={cn(
                                        "h-9 flex-1 rounded-md",
                                        listingType === "Rent"
                                            ? "bg-background text-foreground shadow-sm hover:bg-background"
                                            : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                                    )}
                                >
                                    Rent
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Property Category</Label>
                            <Select
                                value={category.toLowerCase()}
                                onValueChange={(v) => update("category", v === "commercial" ? "Commercial" : "Residential")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="residential">Residential</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* Specs */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Specifications</h3>
                            <p className="text-xs text-muted-foreground">Add key details that buyers filter by.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="property-type">Property Type</Label>
                                <Select value={value.type || ""} onValueChange={(v) => update("type", v)}>
                                    <SelectTrigger id="property-type">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Apartment">Apartment</SelectItem>
                                        <SelectItem value="Villa">Villa</SelectItem>
                                        <SelectItem value="Plot / Land">Plot / Land</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="property-bhk">BHK</Label>
                                <Select value={value.bhk || ""} onValueChange={(v) => update("bhk", v)}>
                                    <SelectTrigger id="property-bhk">
                                        <SelectValue placeholder="Select BHK" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1 BHK">1 BHK</SelectItem>
                                        <SelectItem value="2 BHK">2 BHK</SelectItem>
                                        <SelectItem value="3 BHK">3 BHK</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="property-area">Built-up Area (sq. ft)</Label>
                                <Input
                                    id="property-area"
                                    type="number"
                                    placeholder="e.g. 1500"
                                    value={value.area || ""}
                                    onChange={(e) => update("area", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="property-price">Expected Price (₹)</Label>
                                <Input
                                    id="property-price"
                                    type="number"
                                    placeholder="e.g. 15000000"
                                    value={value.price || ""}
                                    onChange={(e) => update("price", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Location */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Location</h3>
                            <p className="text-xs text-muted-foreground">This helps show your property in nearby searches.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="property-city">City</Label>
                                <Input
                                    id="property-city"
                                    placeholder="Enter City"
                                    value={value.city || ""}
                                    onChange={(e) => update("city", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="property-locality">Locality / Area</Label>
                                <Input
                                    id="property-locality"
                                    placeholder="Enter Locality"
                                    value={value.locality || ""}
                                    onChange={(e) => update("locality", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="property-landmark">Address / Landmark</Label>
                                <Input
                                    id="property-landmark"
                                    placeholder="Enter Address details"
                                    value={value.landmark || ""}
                                    onChange={(e) => update("landmark", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
