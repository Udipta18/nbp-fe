"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import categories from "@/data/categories.json";
import { motion, AnimatePresence } from "framer-motion";

type SearchMode = "services" | "wards";

// Generate ward numbers 1-20
const wards = Array.from({ length: 20 }, (_, i) => ({
    id: `ward-${i + 1}`,
    name: `Ward ${i + 1}`,
    number: i + 1,
}));

export function SearchBar({ className }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchMode, setSearchMode] = React.useState<SearchMode>("services");
    const [results, setResults] = React.useState<typeof categories | typeof wards>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter based on query and mode
    React.useEffect(() => {
        if (query.trim().length < 1) {
            setResults([]);
            return;
        }

        const q = query.toLowerCase();

        if (searchMode === "services") {
            const filtered = categories.filter(
                cat => cat.name.toLowerCase().includes(q)
            );
            setResults(filtered);
        } else {
            const filtered = wards.filter(
                ward => ward.name.toLowerCase().includes(q) || ward.number.toString().includes(q)
            );
            setResults(filtered);
        }
    }, [query, searchMode]);

    // Close on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: { id: string; name: string }) => {
        setQuery("");
        setIsOpen(false);
        if (searchMode === "services") {
            router.push(`/services?category=${item.id}`);
        } else {
            // Navigate to services filtered by ward
            router.push(`/services?ward=${item.id.replace('ward-', '')}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            if (searchMode === "services") {
                router.push(`/services?search=${encodeURIComponent(query.trim())}`);
            } else {
                // Try to parse as ward number
                const wardNum = parseInt(query.trim());
                if (wardNum >= 1 && wardNum <= 20) {
                    router.push(`/services?ward=${wardNum}`);
                } else {
                    router.push(`/services?search=${encodeURIComponent(query.trim())}`);
                }
            }
            setQuery("");
            setIsOpen(false);
        }
    };

    const getPlaceholder = () => {
        return searchMode === "services"
            ? "What service are you looking for?"
            : "Enter ward number (1-20)";
    };

    return (
        <div ref={containerRef} className={cn("relative w-full z-50", className)}>
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-4">
                <div className="inline-flex items-center bg-slate-100 rounded-full p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => {
                            setSearchMode("services");
                            setQuery("");
                            setResults([]);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            searchMode === "services"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Sparkles className="h-4 w-4" />
                        Services
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchMode("wards");
                            setQuery("");
                            setResults([]);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            searchMode === "wards"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <MapPin className="h-4 w-4" />
                        Wards
                    </button>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className={cn(
                    "flex w-full items-center bg-white p-2 rounded-full border border-slate-200 transition-all duration-300",
                    isOpen ? "shadow-xl ring-4 ring-blue-500/10 border-blue-200" : "shadow-md hover:shadow-lg"
                )}
            >
                <div className="pl-4 pr-3 text-slate-400">
                    {searchMode === "services" ? (
                        <Search className="h-5 w-5" />
                    ) : (
                        <MapPin className="h-5 w-5" />
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={getPlaceholder()}
                    className="flex-1 bg-transparent border-0 focus:outline-none text-base text-slate-900 placeholder:text-slate-400 h-10 min-w-0"
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="p-2 hover:bg-slate-100 rounded-full mr-1 transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Search</span>
                    <ArrowRight className="h-4 w-4 sm:hidden" />
                </button>
            </form>

            {/* Dropdown with AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 z-50"
                    >
                        {results.length > 0 ? (
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    {searchMode === "services" ? (
                                        <>
                                            <Sparkles className="h-3 w-3 text-blue-500" />
                                            Suggested Services
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="h-3 w-3 text-blue-500" />
                                            Matching Wards
                                        </>
                                    )}
                                </div>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {results.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleSelect(item)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 rounded-xl group transition-colors"
                                        >
                                            <span className="font-medium text-slate-700 group-hover:text-blue-700">
                                                {item.name}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : query.trim().length > 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-slate-500 text-sm mb-3">
                                    No {searchMode === "services" ? "services" : "wards"} found for "{query}"
                                </p>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-1 mx-auto hover:underline"
                                >
                                    Search anyway <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 pb-6">
                                <div className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    {searchMode === "services" ? "Popular Categories" : "Quick Select"}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {searchMode === "services" ? (
                                        categories.slice(0, 5).map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleSelect(cat)}
                                                className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors border border-slate-100 hover:border-blue-100"
                                            >
                                                {cat.name}
                                            </button>
                                        ))
                                    ) : (
                                        wards.slice(0, 10).map(ward => (
                                            <button
                                                key={ward.id}
                                                onClick={() => handleSelect(ward)}
                                                className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors border border-slate-100 hover:border-blue-100"
                                            >
                                                {ward.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
