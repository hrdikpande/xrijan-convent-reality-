
'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { submitKyc } from '@/app/actions/kyc'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function KycForm({ role }: { role: string }) {
    const [state, action, isPending] = useActionState(submitKyc, { error: '', success: false })

    if (state?.success) {
        return (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-4 shadow-sm">
                <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-emerald-900">Submission Successful</h4>
                    <p className="text-emerald-700">Your KYC documents have been submitted and are pending review.</p>
                </div>
            </div>
        )
    }

    return (
        <form action={action} className="space-y-6">
            {state?.error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="font-medium">{state.error}</p>
                </div>
            )}
            <input type="hidden" name="role" value={role} />

            {role === 'agent' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="pan" className="text-slate-700 font-medium">PAN Number</Label>
                            <Input
                                id="pan"
                                name="pan"
                                placeholder="ABCDE1234F"
                                required
                                className="bg-white/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-900 h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aadhaar" className="text-slate-700 font-medium">Aadhaar Number</Label>
                            <Input
                                id="aadhaar"
                                name="aadhaar"
                                placeholder="1234 5678 9012"
                                required
                                className="bg-white/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-900 h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rera" className="text-slate-700 font-medium">RERA Registration (Upload)</Label>
                        <Input
                            id="rera"
                            name="document"
                            type="file"
                            className="bg-white/50 border-slate-200 file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium hover:file:bg-indigo-100 transition-all text-slate-600 cursor-pointer h-12 py-2"
                            accept=".pdf,.jpg,.png"
                        />
                        <input type="hidden" name="documentType" value="rera_certificate" />
                    </div>
                </div>
            )}

            {role === 'builder' && (
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="project_approval" className="text-slate-700 font-medium">Project Approval Documents</Label>
                        <Input
                            id="project_approval"
                            name="document"
                            type="file"
                            className="bg-white/50 border-slate-200 file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium hover:file:bg-indigo-100 transition-all text-slate-600 cursor-pointer h-12 py-2"
                            accept=".pdf,.jpg,.png"
                        />
                        <input type="hidden" name="documentType" value="project_approval" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="license" className="text-slate-700 font-medium">Builder License Number</Label>
                        <Input
                            id="license"
                            name="licenseNumber"
                            placeholder="BL-123456"
                            required
                            className="bg-white/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-900 h-11"
                        />
                    </div>
                </div>
            )}

            {/* Fallback for other roles or general docs */}
            {!['agent', 'builder'].includes(role) && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium">Verification not currently required for your role.</span>
                </div>
            )}

            {['agent', 'builder'].includes(role) && (
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 h-12 text-lg font-medium transition-all"
                    disabled={isPending}
                    loading={isPending}
                >
                    Submit Verification
                </Button>
            )}
        </form>
    )
}
