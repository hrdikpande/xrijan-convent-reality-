"use client"

import { UploadCloud, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

interface FileUploadProps {
    label?: string
    accept?: string
    multiple?: boolean
    onFilesSelected?: (files: string[]) => void // Mocking returning URLs for now
}

export function FileUpload({ label = "Upload Files", accept, multiple = true, onFilesSelected }: FileUploadProps) {
    const [files, setFiles] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)

    // Mock upload simulation
    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return

        // Simulating upload by just adding placeholders
        const newFiles = Array.from(fileList).map(() => "/placeholder-house.jpg")
        setFiles(prev => {
            const next = [...prev, ...newFiles]
            onFilesSelected?.(next)
            return next
        })
    }

    const removeFile = (index: number) => {
        setFiles(prev => {
            const next = prev.filter((_, i) => i !== index)
            onFilesSelected?.(next)
            return next
        })
    }

    return (
        <div className="w-full">
            <div
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-colors bg-card",
                    isDragging
                        ? "border-primary bg-accent"
                        : "border-border hover:border-border/80 hover:bg-accent/30"
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files)
                }}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary mb-2">
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground mt-1">Drag & drop or browse</p>
                    </div>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept={accept}
                            multiple={multiple}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <Button asChild type="button" variant="outline" size="sm">
                            <span>Browse Files</span>
                        </Button>
                    </label>
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {files.map((file, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-muted group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={file} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeFile(idx)}
                                className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
