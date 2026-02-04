import { Wifi, Car, Dumbbell, Trees, ShieldCheck, Zap, Waves, PartyPopper, CheckCircle } from "lucide-react"

interface AmenitiesListProps {
    amenities?: string[]
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
    const list = amenities && amenities.length > 0 ? amenities : [
        "High Speed Wifi", "Covered Parking", "Gymnasium", "Private Garden",
        "24/7 Security", "Power Backup", "Swimming Pool", "Club House"
    ]

    // Helper to map string to icon (simplified)
    const getIcon = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('wifi')) return Wifi
        if (lower.includes('park')) return Car
        if (lower.includes('gym')) return Dumbbell
        if (lower.includes('garden')) return Trees
        if (lower.includes('security')) return ShieldCheck
        if (lower.includes('power')) return Zap
        if (lower.includes('pool')) return Waves
        if (lower.includes('club')) return PartyPopper
        return CheckCircle
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {list.map((item, idx) => {
                const Icon = getIcon(item)
                return (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-600">
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                )
            })}
        </div>
    )
}
