'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AuthDebugPage() {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [cookies, setCookies] = useState<string>('')

    const checkAuth = useCallback(async () => {
        setLoading(true)
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log('[Auth Debug] Session:', session)
        console.log('[Auth Debug] Error:', error)

        setSession(session)
        setUser(session?.user || null)
        setCookies(document.cookie)
        setLoading(false)
    }, [])

    useEffect(() => {
        let isMounted = true;
        const initAuth = async () => {
            if (isMounted) {
                await checkAuth();
            }
        };
        initAuth();

        // Set up auth state listener
        const supabase = createClient()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('[Auth Debug] Auth state changed:', _event, session)
            setSession(session)
            setUser(session?.user || null)
        })

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        }
    }, [checkAuth])

    const refreshSession = async () => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.refreshSession()
        console.log('[Auth Debug] Refresh result:', data, error)
        await checkAuth()
    }

    const clearSession = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        await checkAuth()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading auth state...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Authentication Debug</h1>
                    <Link href="/dashboard">
                        <Button>Go to Dashboard</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Session Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="font-semibold">Authenticated: </span>
                            <span className={user ? 'text-green-600' : 'text-red-600'}>
                                {user ? 'Yes ✓' : 'No ✗'}
                            </span>
                        </div>

                        {user && (
                            <>
                                <div>
                                    <span className="font-semibold">User ID: </span>
                                    <code className="bg-slate-100 px-2 py-1 rounded text-sm">{user.id}</code>
                                </div>
                                <div>
                                    <span className="font-semibold">Email: </span>
                                    <code className="bg-slate-100 px-2 py-1 rounded text-sm">{user.email}</code>
                                </div>
                                <div>
                                    <span className="font-semibold">Session Expires: </span>
                                    <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                                        {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}
                                    </code>
                                </div>
                            </>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button onClick={checkAuth} variant="outline">
                                Refresh Check
                            </Button>
                            <Button onClick={refreshSession} variant="outline">
                                Refresh Session
                            </Button>
                            <Button onClick={clearSession} variant="destructive">
                                Clear Session
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cookies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">
                            {cookies || 'No cookies found'}
                        </pre>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Full Session Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
                            {JSON.stringify(session, null, 2)}
                        </pre>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/login" className="block">
                            <Button variant="outline" className="w-full">Go to Login</Button>
                        </Link>
                        <Link href="/signup" className="block">
                            <Button variant="outline" className="w-full">Go to Signup</Button>
                        </Link>
                        <Link href="/dashboard" className="block">
                            <Button variant="outline" className="w-full">Go to Dashboard</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
