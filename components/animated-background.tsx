"use client"

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Dot Pattern - Stronger */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.3]" />

            {/* Moving Gradient Orbs - significantly stronger colors */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-400/30 via-purple-300/30 to-blue-400/30 blur-[120px] mix-blend-multiply"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -100, 0],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-teal-300/30 via-emerald-200/30 to-cyan-300/30 blur-[120px] mix-blend-multiply"
            />

            <motion.div
                animate={{
                    y: [0, -50, 0],
                    opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-pink-300/30 blur-[120px] mix-blend-multiply"
            />
        </div>
    )
}
