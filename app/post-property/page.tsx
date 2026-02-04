"use client"

import { useEffect, useState } from "react"
import { Stepper } from "@/components/post-property/stepper"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { StepRole } from "@/components/post-property/steps/step-role"
import { StepDetails } from "@/components/post-property/steps/step-details"
import { StepMedia } from "@/components/post-property/steps/step-media"
import { StepAmenities } from "@/components/post-property/steps/step-amenities"
import { StepContact } from "@/components/post-property/steps/step-contact"
import { StepPublish } from "@/components/post-property/steps/step-publish"
import { submitProperty } from "./actions"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { PostPropertyFormData } from "./types"



export default function PostPropertyPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [minStep, setMinStep] = useState(1)
    const [isAuthChecked, setIsAuthChecked] = useState(false)
    const [formData, setFormData] = useState<PostPropertyFormData>({
        role: "",
        details: {
            listingType: "Sell",
            category: "Residential",
        },
        media: {
            photos: [],
            floor_plans: [],
        },
        amenities: [],
        contact: {
            call: true,
            whatsapp: true,
            chat: true,
        },
    })

    const steps = ["Role", "Details", "Media", "Amenities", "Contact", "Publish"]

    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter() // Requires importing useRouter

    useEffect(() => {
        let mounted = true

        const run = async () => {
            const supabase = createClient()
            const { data: { user }, error } = await supabase.auth.getUser()

            if (!mounted) return

            if (error || !user) {
                router.replace("/login?next=/post-property")
                return
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            const profileRole = profile?.role
            const roleToUse = profileRole && ["owner", "agent", "builder"].includes(profileRole)
                ? profileRole
                : "owner"

            setFormData(prev => ({ ...prev, role: roleToUse }))
            setCurrentStep(2)
            setMinStep(2)

            setIsAuthChecked(true)
        }

        run()
        return () => {
            mounted = false
        }
    }, [router])

    const handleNext = async () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1)
        } else {
            // Submit
            setIsSubmitting(true)
            const result = await submitProperty(formData) // Requires importing submitProperty
            setIsSubmitting(false)

            if (result?.success) {
                if (result?.status === "draft") {
                    alert("Your property was saved as a draft. Complete verification to publish it.")
                    router.push('/dashboard/properties')
                } else {
                    router.push('/search') // Redirect to search on success
                }
            } else {
                alert("Error: " + result?.error)
            }
        }
    }

    const handleBack = () => {
        if (currentStep > minStep) {
            setCurrentStep(prev => Math.max(minStep, prev - 1))
        }
    }

    // Update form data (simplified for now)
    const updateData = <K extends keyof PostPropertyFormData>(key: K, value: PostPropertyFormData[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    if (!isAuthChecked) {
        return <div className="min-h-screen bg-background pt-24 pb-20" />
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Stepper */}
                <div className="mb-12">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                {/* Step Content */}
                <div className="min-h-[400px] mb-12">
                    {currentStep === 1 && <StepRole value={formData.role} onChange={(val) => updateData("role", val)} />}
                    {currentStep === 2 && <StepDetails value={formData.details} onChange={(next) => updateData("details", next)} />}
                    {currentStep === 3 && <StepMedia value={formData.media} onChange={(next) => updateData("media", next)} />}
                    {currentStep === 4 && <StepAmenities value={formData.amenities} onChange={(next) => updateData("amenities", next)} />}
                    {currentStep === 5 && <StepContact value={formData.contact} onChange={(next) => updateData("contact", next)} />}
                    {currentStep === 6 && <StepPublish />}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === minStep}
                        className="rounded-full px-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    {currentStep < steps.length ? (
                        <Button
                            onClick={handleNext}
                            className="rounded-full px-8"
                        >
                            Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="rounded-full px-8"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            Publish Property
                        </Button>
                    )}
                </div>

            </div>
        </div>
    )
}
