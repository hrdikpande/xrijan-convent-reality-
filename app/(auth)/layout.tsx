
import { ReactNode } from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen relative overflow-hidden bg-[#fafafa]">

            {/* Premium Background Composition */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Grain Overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                {/* Soft Gradient Orbs */}
                <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-blue-100/40 to-teal-100/40 blur-[100px]" />

                {/* Modern Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Top Nav */}
            <div className="absolute top-0 left-0 p-8 z-50">
                <Link href="/" className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 transition-colors group bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <Building2 className="w-4 h-4" />
                    <span className="font-semibold text-sm tracking-tight">Back to Home</span>
                </Link>
            </div>

            <div className="relative z-10 w-full flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    )
}
