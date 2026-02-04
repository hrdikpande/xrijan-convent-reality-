"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/cn"

interface StepAmenitiesProps {
    value: string[]
    onChange: (next: string[]) => void
}

export function StepAmenities({ value, onChange }: StepAmenitiesProps) {
    const amenities = [
        "Car Parking", "Lift", "Power Backup", "Gym", "Swimming Pool",
        "Club House", "Security", "Garden / Park", "Intercom", "WiFi"
    ]

    const toggleAmenity = (amenity: string, checked: boolean) => {
        if (checked) {
            if (value.includes(amenity)) return
            onChange([...value, amenity])
            return
        }
        onChange(value.filter(a => a !== amenity))
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Amenities</h2>
                <p className="text-sm text-muted-foreground">Select all available amenities</p>
            </div>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Included</CardTitle>
                    <CardDescription>These help your listing rank higher in searches.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {amenities.map(amenity => {
                            const checked = value.includes(amenity)

                            return (
                                <div
                                    key={amenity}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                                        checked ? "border-primary/30 bg-accent" : "border-border hover:bg-accent/40"
                                    )}
                                >
                                    <Checkbox
                                        id={amenity}
                                        checked={checked}
                                        onCheckedChange={(c) => toggleAmenity(amenity, c === true)}
                                    />
                                    <Label htmlFor={amenity} className="cursor-pointer font-medium text-foreground">
                                        {amenity}
                                    </Label>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
