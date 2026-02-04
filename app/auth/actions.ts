
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type AuthState = {
    error?: string
    message?: string
}

export async function login(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('[Login Action] Attempting login for:', email)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        console.error('[Login Action] Login failed:', error.message)
        return { error: error.message }
    }

    const normalizedEmail = (email || '').trim().toLowerCase()
    const normalizedAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()

    if (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail && data.user) {
        const fullName = (data.user.user_metadata?.full_name as string | undefined) || null
        const { error: adminProfileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: 'admin',
            is_verified: true,
        })

        if (adminProfileError) {
            console.error('[Login Action] Failed to promote admin profile:', adminProfileError)
            return { error: 'Failed to promote admin profile' }
        }
    }

    console.log('[Login Action] Login successful')
    console.log('[Login Action] Session:', data.session ? 'Present' : 'Missing')
    console.log('[Login Action] User ID:', data.user?.id)
    console.log('[Login Action] Session expires at:', data.session?.expires_at)

    // Verify session was created
    const { data: { session } } = await supabase.auth.getSession()
    console.log('[Login Action] Session verification:', session ? 'Session found' : 'NO SESSION')

    revalidatePath('/', 'layout')
    if (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail) {
        redirect('/admin')
    }
    redirect('/dashboard')
}

export async function signup(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const fullName = `${firstName} ${lastName}`.trim()

    const normalizedEmail = (email || '').trim().toLowerCase()
    const normalizedAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.session && data.user) {
        const { error: setSessionError } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        })

        if (setSessionError) {
            console.error('[Signup Action] Failed to set session:', setSessionError)
            return { error: 'Failed to initialize session' }
        }

        // Automatic Admin Promotion
        if (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: 'admin',
                is_verified: true,
            })

            if (profileError) {
                console.error("Error creating admin profile:", profileError)
                return { error: "Failed to create admin profile" }
            }
            redirect('/admin')
        }

        redirect('/role-selection')
    } else {
        if (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail) {
            return { message: 'Check your email for confirmation link, then log in to activate your admin access.' }
        }
        return { message: 'Check your email for confirmation link.' }
    }
}

export async function verifyOtp(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
    const phone = formData.get('phone') as string
    const otp = formData.get('otp') as string
    console.log("Verifying OTP for", phone, otp)

    // Simulate success
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function updateRole(role: string) {
    // This is called via onClick handler, not form action directly usually
    // But if we use it in a form, we'd need to adapt.
    // In the Role page, we used `onClick={() => updateRole(role)}`.
    // This is a direct server action call. It's fine if it doesn't return anything or returns a promise.
    // But direct calls from client components to server actions are fine in React.

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Security: Prevent public from becoming admin via this route
    if (role === 'admin') {
        throw new Error("Unauthorized: Cannot self-assign admin role")
    }

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        role: role,
        email: user.email,
        full_name: user.user_metadata.full_name
    })

    if (error) {
        console.error("Error updating role:", error)
        throw new Error(error.message)
    }

    if (['agent', 'builder'].includes(role)) {
        redirect('/dashboard/kyc')
    } else {
        redirect('/dashboard')
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
