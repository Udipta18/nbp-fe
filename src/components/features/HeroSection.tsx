"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Shield } from "lucide-react";

// Rotating headlines
const headlines = [
    {
        text: "Trusted Local Services in",
        highlight: "New Barrackpur",
    },
    {
        text: "One Stop Solution for",
        highlight: "All Your Needs",
    },
    {
        text: "Now Search Services by",
        highlight: "Your Ward",
    },
    {
        text: "100+ Verified Providers in",
        highlight: "New Barrackpur",
    },
];

export function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % headlines.length);
        }, 4000); // Change every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center text-center space-y-6">
            {/* Premium Badge - Subtle & Elegant */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
            >
                {/* Location indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-slate-200/80 shadow-sm">
                    <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Live in</span>
                    <span className="text-sm font-bold text-slate-900">New Barrackpur</span>
                </div>
            </motion.div>

            {/* Animated Rotating Headline */}
            <div className="h-[120px] md:h-[160px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={currentIndex}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-gray-900"
                    >
                        {headlines[currentIndex].text}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            {headlines[currentIndex].highlight}
                        </span>
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Subheadline */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-600 max-w-[700px]"
            >
                Find trusted plumbers, doctors, electricians, and more. Book services from verified local providers instantly.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 text-sm"
            >
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 text-slate-600 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    Ward-wise Search
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 text-slate-600 shadow-sm">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    All Verified
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 text-slate-600 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    One-Stop Solution
                </div>
            </motion.div>
        </div>
    );
}

