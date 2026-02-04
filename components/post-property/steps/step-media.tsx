"use client"

import { FileUpload } from "@/components/ui/file-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import type { PropertyMediaData } from "@/app/post-property/types"

interface StepMediaProps {
    value: PropertyMediaData
    onChange: (next: PropertyMediaData) => void
}

export function StepMedia({ value, onChange }: StepMediaProps) {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Media & Documents</h2>
                <p className="text-sm text-muted-foreground">Upload clear photos to get more leads.</p>
            </div>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Uploads</CardTitle>
                    <CardDescription>Photos and floor plans help people decide faster.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Property Photos</h3>
                        <FileUpload
                            label="Upload Property Photos"
                            accept="image/*"
                            onFilesSelected={(files) => onChange({ ...value, photos: files })}
                        />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Floor Plans</h3>
                        <FileUpload
                            label="Upload Floor Plans"
                            accept="image/*"
                            onFilesSelected={(files) => onChange({ ...value, floor_plans: files })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
