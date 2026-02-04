"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateProfile } from "@/app/actions/dashboard"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
    profile: {
        full_name?: string
        email?: string
        role?: string
    } | null
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        setMessage(null)

        startTransition(async () => {
            try {
                await updateProfile(formData)
                setMessage({ type: 'success', text: 'Profile updated successfully!' })
                router.refresh()

                // Clear success message after 3 seconds
                setTimeout(() => setMessage(null), 3000)
            } catch {
                setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
            }
        })
    }

    return (
        <>
            {message && (
                <div className={`rounded-lg p-4 ${message.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                    {message.text}
                </div>
            )}

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your basic profile details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    defaultValue={profile?.full_name || ""}
                                    placeholder="John Doe"
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    defaultValue={profile?.email || ""}
                                    disabled
                                    className="bg-muted/40 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-foreground">Role</Label>
                                <Input
                                    id="role"
                                    name="role"
                                    defaultValue={profile?.role || "Buyer"}
                                    disabled
                                    className="bg-muted/40 capitalize cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-sm opacity-60 pointer-events-none">
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>Contact information (Coming Soon).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-foreground">Phone Number</Label>
                            <Input
                                placeholder="+1 234 567 890"
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Address</Label>
                            <Input
                                placeholder="123 Main St"
                                disabled
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
