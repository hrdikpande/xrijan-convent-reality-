'use client'

import { useActionState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

export default function SignupPage() {
    const [state, action, isPending] = useActionState(signup, { error: '', message: '' })

    return (
        <div className="w-full max-w-[400px] animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
                <p className="text-slate-500 mt-2">Get started with Convent Reality</p>
            </div>

            <Card className="border-border/50 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/5">
                <CardContent className="pt-8 px-8">
                    <form action={action} className="space-y-4">
                        {state?.error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {state.error}
                            </div>
                        )}
                        {state?.message && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-500 text-sm">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                {state.message}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                                <Input id="firstName" name="firstName" placeholder="John" required className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                                <Input id="lastName" name="lastName" placeholder="Doe" required className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="name@company.com" required className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <Input id="password" name="password" type="password" required className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>

                        <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-lg font-medium transition-all hover:scale-[1.02] mt-2" type="submit" disabled={isPending} loading={isPending}>
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center py-6 bg-slate-50/50">
                    <p className="text-sm text-slate-500">
                        Already have an account?
                        <Link href="/login" className="ml-1 text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
