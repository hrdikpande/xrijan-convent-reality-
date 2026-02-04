"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, MessageCircle, MessageSquare } from "lucide-react"
import { cn } from "@/utils/cn"

import type { ContactPrefsData } from "@/app/post-property/types"

interface StepContactProps {
    value: ContactPrefsData
    onChange: (next: ContactPrefsData) => void
}

export function StepContact({ value, onChange }: StepContactProps) {
    const callEnabled = value.call ?? true
    const whatsappEnabled = value.whatsapp ?? true
    const chatEnabled = value.chat ?? true

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Contact Preferences</h2>
                <p className="text-sm text-muted-foreground">How should buyers contact you?</p>
            </div>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Choose channels</CardTitle>
                    <CardDescription>Enable the ways you want to receive enquiries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div
                            className={cn(
                                "rounded-2xl border p-5 flex flex-col items-center text-center gap-3 transition-colors",
                                callEnabled ? "border-primary/30 bg-accent" : "border-border hover:bg-accent/40"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                callEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Phone Call</h3>
                                <p className="text-xs text-muted-foreground">Allow calls to your number</p>
                            </div>
                            <div className="pt-1">
                                <Checkbox
                                    id="contact-call"
                                    checked={callEnabled}
                                    onCheckedChange={(c) => onChange({ ...value, call: c === true })}
                                />
                                <Label htmlFor="contact-call" className="sr-only">Phone Call</Label>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "rounded-2xl border p-5 flex flex-col items-center text-center gap-3 transition-colors",
                                whatsappEnabled ? "border-primary/30 bg-accent" : "border-border hover:bg-accent/40"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                whatsappEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">WhatsApp</h3>
                                <p className="text-xs text-muted-foreground">Allow WhatsApp messages</p>
                            </div>
                            <div className="pt-1">
                                <Checkbox
                                    id="contact-whatsapp"
                                    checked={whatsappEnabled}
                                    onCheckedChange={(c) => onChange({ ...value, whatsapp: c === true })}
                                />
                                <Label htmlFor="contact-whatsapp" className="sr-only">WhatsApp</Label>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "rounded-2xl border p-5 flex flex-col items-center text-center gap-3 transition-colors",
                                chatEnabled ? "border-primary/30 bg-accent" : "border-border hover:bg-accent/40"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                chatEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">In-App Chat</h3>
                                <p className="text-xs text-muted-foreground">Chat within the app</p>
                            </div>
                            <div className="pt-1">
                                <Checkbox
                                    id="contact-chat"
                                    checked={chatEnabled}
                                    onCheckedChange={(c) => onChange({ ...value, chat: c === true })}
                                />
                                <Label htmlFor="contact-chat" className="sr-only">In-App Chat</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
