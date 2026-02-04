"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import categories from "@/data/categories.json";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar({ className }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [results, setResults] = React.useState<typeof categories>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter categories based on query
    React.useEffect(() => {
        if (query.trim().length < 1) {
            setResults([]);
            return;
        }

        const q = query.toLowerCase();
        const filtered = categories.filter(
            cat => cat.name.toLowerCase().includes(q)
        );

        setResults(filtered);
    }, [query]);

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

    const handleSelect = (categoryId: string) => {
        setQuery("");
        setIsOpen(false);
        router.push(`/services?category=${categoryId}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/services?search=${encodeURIComponent(query.trim())}`);
            setQuery("");
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className={cn("relative w-full z-50", className)}>
            <form
                onSubmit={handleSubmit}
                className={cn(
                    "flex w-full items-center bg-white p-2 rounded-full border border-slate-200 transition-all duration-300",
                    isOpen ? "shadow-xl ring-4 ring-blue-500/10 border-blue-200" : "shadow-md hover:shadow-lg"
                )}
            >
                <div className="pl-4 pr-3 text-slate-400">
                    <Search className="h-5 w-5" />
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
                    placeholder="What service are you looking for?"
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
                        className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        {results.length > 0 ? (
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-blue-500" />
                                    Suggested Services
                                </div>
                                <div className="space-y-1">
                                    {results.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleSelect(cat.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 rounded-xl group transition-colors"
                                        >
                                            <span className="font-medium text-slate-700 group-hover:text-blue-700">
                                                {cat.name}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : query.trim().length > 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-slate-500 text-sm mb-3">No exact matches found for "{query}"</p>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-1 mx-auto hover:underline"
                                >
                                    Search all providers regarding this <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="p-4">
                                <div className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Popular Categories
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.slice(0, 5).map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleSelect(cat.id)}
                                            className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors border border-slate-100 hover:border-blue-100"
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
