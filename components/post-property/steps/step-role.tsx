"use client"

import { UserCircle, Briefcase, Building } from "lucide-react"
import { cn } from "@/utils/cn"

interface StepRoleProps {
    value: string
    onChange: (role: string) => void
}

export function StepRole({ value, onChange }: StepRoleProps) {
    const roles = [
        { id: "owner", label: "Owner", icon: UserCircle, desc: "List my own property" },
        { id: "agent", label: "Agent", icon: Briefcase, desc: "List on behalf of others" },
        { id: "builder", label: "Builder", icon: Building, desc: "List new projects" },
    ]

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Choose your profile</h2>
                <p className="text-sm text-muted-foreground">How would you like to post this property?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        onClick={() => onChange(role.id)}
                        className={cn(
                            "cursor-pointer rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center text-center gap-4 group bg-card",
                            value === role.id
                                ? "border-primary bg-accent shadow-sm"
                                : "border-border hover:bg-accent/40"
                        )}
                    >
                        <div className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                            value === role.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-accent"
                        )}>
                            <role.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className={cn("font-semibold text-base", value === role.id ? "text-foreground" : "text-foreground")}>{role.label}</h3>
                            <p className="text-sm text-muted-foreground">{role.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
