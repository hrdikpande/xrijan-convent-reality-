'use client'

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, ShieldCheck, Users, BarChart3, Star, Globe, Zap, LogOut, Menu, X, MessageSquare, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { HomeSearch } from "@/components/property-search/home-search";
import { createClient } from "@/utils/supabase/client";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const fetchUserRole = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            setUserRole(profile?.role || null);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session) {
            await fetchUserRole();
        }
        setIsLoading(false);
    }, [fetchUserRole]);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            if (isMounted) {
                await checkAuth();
            }
        };

        initAuth();

        // Subscribe to auth changes
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            if (session) {
                fetchUserRole();
            } else {
                setUserRole(null);
            }
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [checkAuth, fetchUserRole]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600/20 relative overflow-hidden">
            <AnimatedBackground />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-base sm:text-lg tracking-tight text-slate-900">Convent<span className="text-slate-400">Reality</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
                        {[
                            { label: "Buy", href: "/search?listingType=Sell" },
                            { label: "Rent", href: "/search?listingType=Rent" },
                            ...(!isAuthenticated || (userRole && !['buyer', 'tenant'].includes(userRole)) ? [{ label: "List", href: "/post-property" }] : []),
                            { label: "Agents", href: "/signup" },
                        ].map((item) => (
                            <Link key={item.label} href={item.href} className="hover:text-slate-900 transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    {!isLoading && (
                        <div className="hidden md:flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/dashboard">
                                        <Button variant="ghost" className="text-sm font-semibold hover:text-blue-600 transition-colors">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="rounded-full border-slate-300 hover:bg-slate-100 px-6 h-10 text-sm"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                        Log in
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6 h-10 text-sm shadow-md shadow-slate-900/10">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200">
                        <div className="px-4 py-4 space-y-3">
                            {[
                                { label: "Buy", href: "/search?listingType=Sell" },
                                { label: "Rent", href: "/search?listingType=Rent" },
                                ...(!isAuthenticated || (userRole && !['buyer', 'tenant'].includes(userRole)) ? [{ label: "List", href: "/post-property" }] : []),
                                { label: "Agents", href: "/signup" },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block py-2 text-slate-600 hover:text-slate-900 font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {!isLoading && (
                                <div className="pt-3 border-t border-slate-200 space-y-2">
                                    {isAuthenticated ? (
                                        <>
                                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start text-sm font-semibold">
                                                    Dashboard
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                                variant="outline"
                                                className="w-full justify-start"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start">
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full bg-slate-900 text-white">
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero */}
            <main className="relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-20"
                >
                    <motion.div variants={item} className="mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span className="hidden sm:inline">Trusted Marketplace for Modern Real Estate</span>
                        <span className="sm:hidden">Trusted Real Estate</span>
                    </motion.div>

                    <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.05] text-slate-900 px-2">
                        Find the property <br />
                        <span className="text-slate-400">that fits your next move.</span>
                    </motion.h1>

                    <motion.p variants={item} className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-8 sm:mb-12 leading-relaxed px-4">
                        Verified listings, transparent pricing, and direct access to owners, builders, and certified agents. Built to help you buy, rent, or list with confidence.
                    </motion.p>

                    <motion.div variants={item} className="w-full flex justify-center px-2">
                        <HomeSearch userRole={userRole} />
                    </motion.div>
                </motion.div>

                {/* Bento Grid Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 auto-rows-[240px] sm:auto-rows-[300px]"
                >
                    {/* Main Feature - Large */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-7 md:row-span-2 rounded-[2.5rem] bg-white/80 border border-slate-200/60 p-8 sm:p-12 flex flex-col justify-between overflow-hidden relative group shadow-xl shadow-slate-200/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-600/20 transition-colors duration-700" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-900/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm mb-8 group-hover:scale-105 transition-transform duration-500">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verified &amp; Secure</span>
                            </div>

                            <h3 className="text-3xl sm:text-5xl font-bold mb-6 text-slate-900 leading-[1.1] tracking-tight">
                                Compliance-driven <br />
                                <span className="text-blue-700">listings.</span>
                            </h3>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
                                Every property and profile is vetted through KYC, ownership validation, and listing audits so you can transact with confidence.
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-50 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-400 shadow-md transform group-hover:translate-x-1 transition-transform duration-500" style={{ transitionDelay: `${i * 50}ms` }}>
                                            {i === 4 ? (
                                                <div className="w-full h-full bg-blue-700 text-white flex items-center justify-center">+3k</div>
                                            ) : (
                                                <Users className="w-5 h-5 opacity-40" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">3,120+</p>
                                    <p className="text-xs font-medium text-slate-500">Certified Agents Onboarded</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/20 text-white flex items-center gap-4 group-hover:translate-x-2 transition-transform duration-500">
                                <ShieldCheck className="w-8 h-8" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Trust Index</p>
                                    <p className="text-xl font-bold">98.7%</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Feature - Tall */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-5 md:row-span-2 rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-10 flex flex-col relative overflow-hidden group shadow-2xl shadow-slate-900/20"
                    >
                        <div className="absolute inset-0 opacity-50">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,_#1d4ed8_0%,_transparent_55%)]" />
                            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_#0f172a_0%,_transparent_55%)]" />
                        </div>

                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-150 contrast-150 mix-blend-overlay" />

                        <div className="relative z-10 flex-1 flex flex-col justify-between">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center mb-10 border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                                <Zap className="w-8 h-8 text-amber-300" />
                            </div>

                            <div>
                                <h3 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Direct <br /><span className="text-blue-300">connections.</span></h3>
                                <p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">
                                    Engage with owners and builders instantly. Secure messaging keeps negotiations efficient and transparent.
                                </p>

                                <Link href="/signup" className="block">
                                    <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 transition-all text-lg font-bold shadow-xl shadow-white/5 active:scale-95">
                                        Experience the platform
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>

                                <div className="mt-8 flex items-center justify-center gap-6 text-slate-400">
                                    <div className="flex flex-col items-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-600 mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Realtime</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-600 mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Audited</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-600 mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tertiary Feature - Wide */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-6 rounded-[2.5rem] bg-blue-700 p-8 flex items-center justify-between overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/5 skew-x-[-20deg] translate-x-1/2" />

                        <div className="relative z-10 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Market Intelligence</h3>
                            <p className="text-blue-100/80 font-medium max-w-[220px]">Live pricing trends and demand insights tailored to your city.</p>
                        </div>

                        <div className="relative z-10 h-full flex items-center pr-4">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                                <BarChart3 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Quaternary Feature */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-6 rounded-[2.5rem] bg-white border border-slate-200/60 p-8 flex items-center justify-between overflow-hidden relative group shadow-lg shadow-slate-200/10"
                    >
                        <div className="relative z-10 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Nationwide Coverage</h3>
                            <p className="text-slate-500 font-medium max-w-[220px]">Expert presence across fast-growing metros and investment hubs.</p>
                        </div>

                        <div className="relative z-10 flex items-center gap-4">
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">LIVE</span>
                                <span className="text-2xl font-black text-slate-800">140+</span>
                            </div>
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-colors duration-500">
                                <Globe className="w-10 h-10 text-slate-900 group-hover:rotate-12 transition-transform duration-500" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Statistics Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 mb-20"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                        {[
                            { value: "62K+", label: "Active Listings", icon: Building2 },
                            { value: "2.4M+", label: "Verified Users", icon: Users },
                            { value: "140+", label: "Cities Covered", icon: Globe },
                            { value: "<2hrs", label: "Avg Response Time", icon: Zap }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="bg-white/80 border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center hover:shadow-xl hover:border-slate-200 transition-all duration-300"
                            >
                                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-4 text-blue-700" />
                                <div className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-slate-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How It Works Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-40 mb-32 relative"
                >
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-[600px] bg-white -z-10 skew-y-2" />

                    <div className="text-center mb-24 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-6"
                        >
                            The Process
                        </motion.div>
                        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            A clear path to <br />
                            <span className="text-blue-700">confident decisions.</span>
                        </h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            From discovery to decision, every step is designed to reduce friction and improve trust.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative max-w-6xl mx-auto px-4">
                        <div className="hidden md:grid grid-cols-2 absolute top-[4.5rem] left-[15%] right-[15%] h-px gap-20 -z-10">
                            <div className="bg-gradient-to-r from-transparent via-blue-200 to-transparent relative">
                                <motion.div
                                    className="absolute top-0 left-0 w-2 h-2 -mt-[3px] bg-blue-600 rounded-full"
                                    animate={{ left: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <div className="bg-gradient-to-r from-transparent via-blue-200 to-transparent relative">
                                <motion.div
                                    className="absolute top-0 left-0 w-2 h-2 -mt-[3px] bg-blue-600 rounded-full"
                                    animate={{ left: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                />
                            </div>
                        </div>

                        {[
                            {
                                step: "01",
                                title: "Discover",
                                description: "Search verified listings with precision filters across price, location, and amenities.",
                                icon: <Building2 className="w-8 h-8" />,
                                color: "bg-blue-700",
                                shadow: "shadow-blue-700/20"
                            },
                            {
                                step: "02",
                                title: "Engage",
                                description: "Speak directly with owners and builders through secure, auditable messaging.",
                                icon: <MessageSquare className="w-8 h-8" />,
                                color: "bg-slate-900",
                                shadow: "shadow-slate-900/20"
                            },
                            {
                                step: "03",
                                title: "Finalize",
                                description: "Close confidently with documentation support and transparent pricing timelines.",
                                icon: <Zap className="w-8 h-8" />,
                                color: "bg-emerald-600",
                                shadow: "shadow-emerald-600/20"
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.6 }}
                                whileHover={{ y: -10 }}
                                className="relative bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-xl shadow-slate-200/40 group hover:border-blue-100 transition-all duration-500"
                            >
                                <div className={`w-20 h-20 ${step.color} ${step.shadow} rounded-[1.75rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 relative`}>
                                    <div className="absolute inset-0 bg-white/20 rounded-[1.75rem] scale-90 group-hover:scale-100 transition-transform duration-500" />
                                    {step.icon}
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-xs font-black text-slate-900 shadow-md">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-700 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {step.description}
                                </p>

                                <div className="mt-8 pt-8 border-t border-slate-50 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Property Categories Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-40 mb-32"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-blue-700 font-bold text-sm uppercase tracking-[0.2em] mb-4"
                            >
                                Curated Collections
                            </motion.div>
                            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                Explore by <br />
                                <span className="text-slate-400">property focus.</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm">
                            Spaces for every need, from premium residences to high-performing commercial assets.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-[200px] sm:auto-rows-[240px] px-2">
                        {[
                            { name: "Signature Apartments", count: "12,450", slug: "apartments", colSpan: "md:col-span-2", rowSpan: "md:row-span-2", bg: "from-blue-600/90 to-blue-800/90", icon: <Building2 className="w-10 h-10" /> },
                            { name: "Luxury Villas", count: "3,210", slug: "villas", colSpan: "md:col-span-2", rowSpan: "md:row-span-1", bg: "from-emerald-500/90 to-emerald-700/90", icon: <Star className="w-8 h-8" /> },
                            { name: "Commercial Spaces", count: "5,840", slug: "commercial", colSpan: "md:col-span-1", rowSpan: "md:row-span-2", bg: "from-slate-800/95 to-slate-950/95", icon: <Globe className="w-8 h-8" /> },
                            { name: "Investment Plots", count: "8,120", slug: "plots", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", bg: "from-amber-500/90 to-orange-600/90", icon: <ArrowRight className="w-6 h-6" /> },
                            { name: "Country Estates", count: "1,530", slug: "farmhouses", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", bg: "from-purple-600/90 to-violet-700/90", icon: <Users className="w-8 h-8" /> },
                        ].map((category, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                className={`${category.colSpan} ${category.rowSpan} rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-200/20`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.bg} transition-transform duration-700 group-hover:scale-110`} />

                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                                            {category.icon}
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            Explore
                                        </div>
                                    </div>

                                    <div className="transform group-hover:translate-y-[-4px] transition-transform duration-500">
                                        <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">{category.count} Listings</p>
                                        <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 mb-20"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">Trusted by buyers and investors</h2>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">Decision makers rely on Convent Reality for verified listings and responsive service.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                name: "Priya Sharma",
                                role: "First-time Home Buyer",
                                avatar: "PS",
                                rating: 5,
                                quote: "The verification checks gave me real confidence. I closed on a home within three weeks with clear communication throughout."
                            },
                            {
                                name: "Rajesh Kumar",
                                role: "Property Investor",
                                avatar: "RK",
                                rating: 5,
                                quote: "The market intelligence dashboard is sharp and practical. It saves me hours every week when evaluating deals."
                            },
                            {
                                name: "Anita Desai",
                                role: "Relocated Professional",
                                avatar: "AD",
                                rating: 5,
                                quote: "No brokerage surprises and no spam. The experience was efficient, professional, and highly transparent."
                            }
                        ].map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.6 }}
                                className="bg-white/80 border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Final CTA Section */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-40 mb-32 px-4"
                >
                    <div className="max-w-7xl mx-auto relative group">
                        <div className="bg-slate-900 rounded-[3rem] p-12 sm:p-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.6)]">
                            <div className="absolute inset-0">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_#1d4ed8_0%,_transparent_50%)] opacity-40" />
                                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_#0f172a_0%,_transparent_55%)] opacity-40" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px]" />
                            </div>

                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-12 left-12 w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 hidden lg:flex items-center justify-center -rotate-6"
                            >
                                <Building2 className="w-10 h-10 text-blue-300" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-12 right-12 w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 hidden lg:flex items-center justify-center rotate-12"
                            >
                                <Zap className="w-12 h-12 text-amber-300" />
                            </motion.div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-blue-200 uppercase tracking-widest mb-8"
                                >
                                    The Next Step
                                </motion.div>

                                <h2 className="text-4xl sm:text-7xl font-black mb-8 leading-[1] tracking-tight">
                                    Move with <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-slate-200 to-blue-200">
                                        clarity and confidence.
                                    </span>
                                </h2>

                                <p className="text-lg sm:text-2xl text-slate-300 mb-12 leading-relaxed font-medium">
                                    Join thousands of buyers, renters, and investors choosing a verified, professional real estate experience.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link href="/search" className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 h-16 px-12 rounded-2xl text-xl font-black shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] active:scale-95 transition-all group">
                                            Start Searching
                                            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </Link>

                                    {(!isAuthenticated || (userRole && !['buyer', 'tenant'].includes(userRole))) && (
                                        <Link href="/post-property" className="w-full sm:w-auto">
                                            <Button variant="ghost" className="w-full sm:w-auto border-2 border-white/20 hover:bg-white/10 hover:text-white text-white h-16 px-12 rounded-2xl text-xl font-bold backdrop-blur-md active:scale-95 transition-all">
                                                List Property
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-16 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-8 sm:gap-16 opacity-60">
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold">100%</span>
                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Verified</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold">24/7</span>
                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Support</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold">0%</span>
                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Brokerage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-24 pb-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                        <div className="lg:col-span-4 space-y-8">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-slate-900">Convent<span className="text-slate-400">Reality</span></span>
                            </Link>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                                A professional real estate marketplace focused on verified listings, transparent pricing, and long-term trust.
                            </p>
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: Facebook, href: "#" },
                                    { icon: Twitter, href: "#" },
                                    { icon: Instagram, href: "#" },
                                    { icon: Linkedin, href: "#" }
                                ].map((social, i) => (
                                    <a key={i} href={social.href} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Platform</h4>
                            <ul className="space-y-4">
                                {["Buy Properties", "Rent Properties", "List Property", "Find Agents", "Virtual Tours"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Company</h4>
                            <ul className="space-y-4">
                                {["About Us", "Our Process", "Careers", "Market Reports", "Contact"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-2">Weekly market brief</h4>
                                <p className="text-slate-500 text-sm mb-6 font-medium">Insights, price trends, and new listings delivered every Friday.</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                    />
                                    <Button className="rounded-xl h-10 px-4 bg-slate-900 text-white hover:bg-slate-800">
                                        Join
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-400">
                            <p>© 2026 Convent Reality Inc. All rights reserved.</p>
                        </div>
                        <div className="flex gap-8 text-sm font-bold text-slate-900">
                            <Link href="#" className="hover:text-blue-700 transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-blue-700 transition-colors">Terms of Service</Link>
                            <Link href="#" className="hover:text-blue-700 transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
