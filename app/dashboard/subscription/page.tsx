import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"

export default function SubscriptionPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Subscription & Billing</h2>
                <p className="text-slate-500">Manage your plan and credits.</p>
            </div>

            {/* Current Plan */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">Free Agent Plan</CardTitle>
                            <CardDescription className="text-slate-300">Basic features for new agents.</CardDescription>
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                            Active
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Listings</p>
                            <p className="text-2xl font-bold">1/3</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Credits</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" className="w-full bg-white text-slate-900 hover:bg-slate-100">
                        Upgrade Plan
                    </Button>
                </CardFooter>
            </Card>

            {/* Plans Grid */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Starter */}
                    <Card className="border-slate-200 shadow-sm relative overflow-hidden">
                        <CardHeader>
                            <CardTitle>Starter</CardTitle>
                            <CardDescription>For individuals</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">Free</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 3 Active Listings</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic Analytics</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Web Leads</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button disabled variant="outline" className="w-full">Current Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro */}
                    <Card className="border-indigo-200 shadow-md ring-1 ring-indigo-500 relative">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl">
                            Most Popular
                        </div>
                        <CardHeader>
                            <CardTitle className="text-indigo-600 flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-indigo-600" /> Pro Agent
                            </CardTitle>
                            <CardDescription>For serious realtors</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">₹2,999</span>
                                <span className="text-slate-500 text-sm">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> 20 Active Listings</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Advanced Analytics</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Verified Badge</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Priority Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Upgrade to Pro</Button>
                        </CardFooter>
                    </Card>

                    {/* Agency */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Agency</CardTitle>
                            <CardDescription>For teams</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">₹9,999</span>
                                <span className="text-slate-500 text-sm">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-500" /> Unlimited Listings</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-500" /> Team Management</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-500" /> Dedicated Manager</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-500" /> API Access</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
