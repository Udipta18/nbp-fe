"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, Filter, MapPin, Layers, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileFilterProps {
    categories: Array<{ id: string; name: string }>;
    selectedCategory?: string;
    currentWard?: number;
}

export function MobileFilter({ categories, selectedCategory, currentWard }: MobileFilterProps) {
    const [open, setOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<"category" | "ward">("category");

    const hasFilters = selectedCategory || currentWard;

    // Build URL with current filters preserved
    const buildUrl = (category?: string, ward?: number) => {
        let url = '/services';
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (ward) params.set('ward', ward.toString());
        if (params.toString()) url += `?${params.toString()}`;
        return url;
    };

    return (
        <>
            {/* Filter Button - Premium Style */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                <Filter className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Filters</span>
                {hasFilters && (
                    <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
                        {(selectedCategory ? 1 : 0) + (currentWard ? 1 : 0)}
                    </span>
                )}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Sheet */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: open ? 0 : "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-[0_-10px_60px_rgba(0,0,0,0.15)]"
            >
                {/* Handle */}
                <div className="flex justify-center pt-4 pb-3">
                    <div className="w-10 h-1 rounded-full bg-slate-300" />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center px-6 pb-5">
                    <h3 className="text-2xl font-bold text-slate-900">Filters</h3>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-600" />
                    </button>
                </div>

                {/* Premium Tab Pills */}
                <div className="px-6 pb-5">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab("category")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all",
                                activeTab === "category"
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <Layers className="h-4 w-4" />
                            Category
                            {selectedCategory && activeTab !== "category" && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("ward")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all",
                                activeTab === "ward"
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <MapPin className="h-4 w-4" />
                            Ward
                            {currentWard && activeTab !== "ward" && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-6 pb-6 max-h-[45vh] overflow-y-auto">
                    {activeTab === "category" ? (
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href={buildUrl(undefined, currentWard)}
                                onClick={() => setOpen(false)}
                                scroll={false}
                                className={cn(
                                    "px-4 py-4 rounded-2xl text-center font-semibold transition-all text-sm",
                                    !selectedCategory
                                        ? "bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/30"
                                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                                )}
                            >
                                All Services
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={buildUrl(cat.id, currentWard)}
                                    onClick={() => setOpen(false)}
                                    scroll={false}
                                    className={cn(
                                        "px-4 py-4 rounded-2xl text-center font-semibold transition-all text-sm",
                                        selectedCategory === cat.id
                                            ? "bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/30"
                                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                                    )}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* All Wards Option */}
                            <Link
                                href={buildUrl(selectedCategory, undefined)}
                                onClick={() => setOpen(false)}
                                scroll={false}
                                className={cn(
                                    "block px-4 py-4 rounded-2xl text-center font-semibold transition-all text-sm",
                                    !currentWard
                                        ? "bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/30"
                                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                                )}
                            >
                                All Wards
                            </Link>

                            {/* Ward Grid - Premium 5 columns */}
                            <div className="grid grid-cols-5 gap-2.5">
                                {Array.from({ length: 20 }, (_, i) => {
                                    const wardNum = i + 1;
                                    const isSelected = currentWard === wardNum;
                                    return (
                                        <Link
                                            key={wardNum}
                                            href={buildUrl(selectedCategory, wardNum)}
                                            onClick={() => setOpen(false)}
                                            scroll={false}
                                            className={cn(
                                                "aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition-all",
                                                isSelected
                                                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/30 scale-105"
                                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 hover:scale-105"
                                            )}
                                        >
                                            {wardNum}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Premium Active Filters Footer */}
                {hasFilters && (
                    <div className="mx-4 mb-32 p-4 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200/50 shadow-inner">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active</span>
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 text-xs font-semibold rounded-full shadow-sm border border-blue-100">
                                        <Layers className="h-3 w-3" />
                                        {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                                    </span>
                                )}
                                {currentWard && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 text-xs font-semibold rounded-full shadow-sm border border-blue-100">
                                        <MapPin className="h-3 w-3" />
                                        Ward {currentWard}
                                    </span>
                                )}
                            </div>
                            <Link
                                href="/services"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 bg-white hover:bg-red-50 rounded-full border border-slate-200 hover:border-red-200 transition-all shadow-sm"
                            >
                                <Trash2 className="h-3 w-3" />
                                Clear
                            </Link>
                        </div>
                    </div>
                )}

                {/* Safe area for bottom nav - always present */}
                {!hasFilters && <div className="h-32" />}
            </motion.div>
        </>
    );
}
