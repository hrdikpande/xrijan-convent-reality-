"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Zap } from "lucide-react"

export function StepPublish() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Almost done</h2>
                <p className="text-sm text-muted-foreground">Choose a plan to publish your property</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Basic Listing</CardTitle>
                        <CardDescription>Good for a standard listing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-3xl font-semibold text-foreground">Free</div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Listed for 30 days</li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Standard visibility</li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Email support</li>
                        </ul>
                        <Button variant="outline" className="w-full">Select Basic</Button>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-primary/30 shadow-lg shadow-primary/10">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CardTitle className="text-xl">Premium Boost</CardTitle>
                                <CardDescription>Boost visibility and get more leads.</CardDescription>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-3xl font-semibold text-foreground">₹999</div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Top placement for 30 days</li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Verified badge</li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> 10x more leads</li>
                        </ul>
                        <Button className="w-full">Select Premium</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
