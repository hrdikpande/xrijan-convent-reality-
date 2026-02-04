
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import KycForm from './kyc-form'

export default async function KycPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('[Page: KYC] User:', !!user);
    if (error) console.log('[Page: KYC] Error:', error.message);

    if (!user) {
        console.log('[Page: KYC] Redirecting to login');
        redirect('/login')
    }

    // Fetch role
    const { data: profile } = await supabase.from('profiles').select('role, is_verified').eq('id', user.id).single()

    // Default to agent for dev if no profile found (or handle error)
    const role = profile?.role || 'agent'
    const isVerified = profile?.is_verified

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                    Verification Center
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl">
                    Complete your verification to access exclusive features and start your journey.
                </p>
            </div>

            {isVerified ? (
                <Card className="bg-emerald-50/50 border-emerald-100 backdrop-blur-xl shadow-lg">
                    <CardContent className="pt-8 pb-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-inner">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-1">Verified Account</h3>
                            <p className="text-slate-600">Your account is fully verified and active. You have full access to all features.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-white/40 bg-white/60 backdrop-blur-2xl shadow-xl ring-1 ring-white/60">
                    <CardHeader className="pb-2 border-b border-slate-200/50">
                        <CardTitle className="text-2xl text-slate-800">Submit KYC Documents</CardTitle>
                        <CardDescription className="text-slate-500 text-base">
                            Upload required documents for <span className="font-semibold text-indigo-600 uppercase tracking-wide">{role}</span> verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <KycForm role={role} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
