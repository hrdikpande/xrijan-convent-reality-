
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type KycState = {
    error?: string
    success?: boolean
}

export async function submitKyc(prevState: KycState | undefined, formData: FormData): Promise<KycState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const documentType = formData.get('documentType') as string
    // Mock upload logic
    const mockUrl = `https://example.com/documents/${user.id}/${documentType}.pdf`

    const metadata: Record<string, unknown> = {
        licenseNumber: formData.get('licenseNumber')
    }

    if (formData.get('aadhaar')) metadata.aadhaar = formData.get('aadhaar')
    if (formData.get('pan')) metadata.pan = formData.get('pan')

    const { error } = await supabase.from('kyc_records').insert({
        user_id: user.id,
        document_type: documentType,
        document_urls: [mockUrl], // Array
        status: 'pending',
        metadata: metadata
    })

    if (error) {
        console.error("KYC Submit Error:", error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/kyc')
    return { success: true }
}
