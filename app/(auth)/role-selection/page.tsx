
'use client'

import { Button } from '@/components/ui/button'
import { Building2, Home, Key, HardHat, Briefcase, Check } from 'lucide-react'
import { useState } from 'react'
import { updateRole } from '@/app/auth/actions'
import { cn } from '@/utils/cn'

const roles = [
    {
        id: 'buyer',
        title: 'Buyer',
        description: 'Looking to buy property',
        icon: Home,
    },
    {
        id: 'tenant',
        title: 'Tenant',
        description: 'Looking to rent property',
        icon: Key,
    },
    {
        id: 'owner',
        title: 'Owner',
        description: 'List property for sale/rent',
        icon: Building2,
    },
    {
        id: 'agent',
        title: 'Agent',
        description: 'Real estate professional',
        icon: Briefcase,
    },
    {
        id: 'builder',
        title: 'Builder',
        description: 'Property developer',
        icon: HardHat,
    },
]

export default function RoleSelectionPage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null)

    return (
        <div className="w-full max-w-2xl py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Select Account Type
                </h1>
                <p className="text-muted-foreground">
                    Choose the role that best describes you
                </p>
            </div>

            <div className="grid gap-4">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className={cn(
                            "flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200",
                            selectedRole === role.id
                                ? "bg-primary/5 border-primary text-foreground ring-1 ring-primary"
                                : "bg-card border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedRole(role.id)}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors",
                            selectedRole === role.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                        )}>
                            <role.icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold">{role.title}</h3>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>

                        {selectedRole === role.id && (
                            <div className="text-primary">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <Button
                    size="lg"
                    className="w-full max-w-[200px]"
                    disabled={!selectedRole}
                    onClick={() => selectedRole && updateRole(selectedRole)}
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
