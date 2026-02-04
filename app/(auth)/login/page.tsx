
'use client'

import { useActionState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { login } from '@/app/auth/actions'
import { AlertCircle, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, { error: '', message: '' })

    return (
        <div className="w-full max-w-[400px] animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                <p className="text-slate-500 mt-2">Sign in to your account</p>
            </div>

            <Card className="border-border/50 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/5">
                <CardContent className="pt-8 px-8">
                    <form action={action} className="space-y-5">
                        {state?.error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {state.error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                            <div className="relative">
                                <Input id="email" name="email" type="email" placeholder="name@company.com" required className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700">Password</Label>
                                <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Input id="password" name="password" type="password" required className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                        <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-lg font-medium transition-all hover:scale-[1.02]" type="submit" disabled={isPending} loading={isPending}>
                            Sign In
                            <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                        </Button>
                    </form>


                </CardContent>
                <CardFooter className="justify-center py-6 bg-slate-50/50">
                    <p className="text-sm text-slate-500">
                        Don&apos;t have an account?
                        <Link href="/signup" className="ml-1 text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                            Create account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
