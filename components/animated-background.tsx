"use client"

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.2]" />

            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.35, 0.55, 0.35]
                }}
                transition={{
                    duration: 26,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-blue-300/25 via-indigo-200/20 to-slate-200/30 blur-[140px] mix-blend-multiply"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, -100, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-emerald-200/20 via-cyan-200/20 to-blue-200/20 blur-[140px] mix-blend-multiply"
            />

            <motion.div
                animate={{
                    y: [0, -50, 0],
                    opacity: [0.25, 0.45, 0.25]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-slate-300/20 blur-[140px] mix-blend-multiply"
            />
        </div>
    )
}
