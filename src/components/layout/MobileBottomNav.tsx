"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Grid2X2, Briefcase, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        label: "Services",
        href: "/services",
        icon: Grid2X2,
    },
    {
        label: "Provider",
        href: "/providers",
        icon: Briefcase,
    },
    {
        label: "Contact",
        href: "/contact",
        icon: MessageCircle,
    },
];

export function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const getInitialIndex = () => {
        const index = navItems.findIndex(item => item.href === pathname);
        return index !== -1 ? index : 0;
    };

    const [activeIndex, setActiveIndex] = React.useState(getInitialIndex);
    const [isDragging, setIsDragging] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const index = navItems.findIndex(item => item.href === pathname);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [pathname]);

    const getIndexFromPosition = (clientX: number): number => {
        if (!containerRef.current) return activeIndex;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const sectionWidth = rect.width / navItems.length;
        const index = Math.floor(x / sectionWidth);

        return Math.max(0, Math.min(navItems.length - 1, index));
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        containerRef.current?.setPointerCapture(e.pointerId);
        const index = getIndexFromPosition(e.clientX);
        setActiveIndex(index);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const index = getIndexFromPosition(e.clientX);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const handlePointerUp = () => {
        if (isDragging) {
            setIsDragging(false);
            const targetHref = navItems[activeIndex].href;
            if (pathname !== targetHref) {
                router.push(targetHref);
            }
        }
    };

    const handlePointerLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            const index = navItems.findIndex(item => item.href === pathname);
            if (index !== -1) setActiveIndex(index);
        }
    };

    const handleTap = (index: number) => {
        if (!isDragging) {
            setActiveIndex(index);
            const targetHref = navItems[index].href;
            if (pathname !== targetHref) {
                router.push(targetHref);
            }
        }
    };

    return (
        <div className="fixed bottom-5 left-0 right-0 z-50 px-6 sm:hidden pointer-events-none flex justify-center">
            {/* Outer glow layer */}
            <motion.div
                ref={containerRef}
                initial={{ y: 80, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1
                }}
                className={cn(
                    "relative pointer-events-auto flex items-center w-full max-w-[300px]",
                    "bg-white/90 backdrop-blur-2xl",
                    "border border-white/60",
                    "rounded-[28px]",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]",
                    "p-1.5",
                    "touch-none select-none cursor-pointer"
                )}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerLeave}
            >
                {navItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.href}
                            onClick={() => handleTap(index)}
                            className="relative z-10 flex-1 flex flex-col items-center justify-center h-12"
                        >
                            {/* Active pill with gradient and glow */}
                            {isActive && (
                                <motion.div
                                    layoutId="navPillActive"
                                    className={cn(
                                        "absolute inset-0.5",
                                        "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
                                        "rounded-[22px]",
                                        "shadow-[0_4px_12px_rgba(59,130,246,0.4),0_2px_4px_rgba(59,130,246,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]"
                                    )}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                        mass: 0.8
                                    }}
                                />
                            )}

                            <motion.div
                                className="relative z-10 flex flex-col items-center justify-center"
                                animate={{
                                    scale: isActive ? 1 : 0.92,
                                    y: isActive ? 0 : 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                            >
                                <Icon
                                    className={cn(
                                        "h-[22px] w-[22px] transition-all duration-200 ease-out",
                                        isActive
                                            ? "text-white drop-shadow-sm"
                                            : "text-slate-400"
                                    )}
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                            </motion.div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
