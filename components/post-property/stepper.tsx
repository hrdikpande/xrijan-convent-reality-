"use client"

import { Check } from "lucide-react"
import { cn } from "@/utils/cn"

interface StepperProps {
    steps: string[]
    currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line - Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border/60 -z-10 rounded-full" />

                {/* Connecting Line - Progress */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index + 1 < currentStep
                    const isCurrent = index + 1 === currentStep

                    return (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 z-10",
                                    isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                        isCurrent ? "bg-background border-primary text-primary shadow-sm scale-110" :
                                            "bg-background border-border text-muted-foreground"
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                            <span className={cn(
                                "text-[10px] uppercase font-bold tracking-wider absolute top-10 w-24 text-center transition-colors duration-300 hidden md:block",
                                isCurrent ? "text-primary" :
                                    isCompleted ? "text-foreground" : "text-muted-foreground/60"
                            )}>
                                {step}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
