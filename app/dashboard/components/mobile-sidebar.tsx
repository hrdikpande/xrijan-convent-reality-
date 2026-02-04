"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"

export function MobileSidebar({ role }: { role?: string }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [prevPathname, setPrevPathname] = useState(pathname)

    // Close sidebar on route change - non-effect pattern
    if (pathname !== prevPathname) {
        setIsOpen(false)
        setPrevPathname(pathname)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) {
        return <Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-500 hover:text-slate-900"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>

            {mounted && createPortal(
                <>
                    {/* Backdrop */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
                            onClick={() => setIsOpen(false)}
                        />
                    )}

                    {/* Sidebar Panel */}
                    <div
                        className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <span className="font-semibold text-lg text-slate-900">Menu</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-500 hover:text-slate-900"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <SidebarNav role={role} />
                            </div>
                            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400">
                                © 2024 ConventReality
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}
