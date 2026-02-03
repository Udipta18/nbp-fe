"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import categories from "@/data/categories.json";

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
            router.push(`/services?q=${encodeURIComponent(query.trim())}`);
            setQuery("");
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <form
                onSubmit={handleSubmit}
                className="flex w-full items-center bg-white p-1.5 sm:p-2 rounded-full border shadow-lg"
            >
                <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search services..."
                    className="flex-1 bg-transparent border-0 focus:outline-none text-base px-3 min-w-0 placeholder:text-muted-foreground/70"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full mr-1 transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                    Search
                </button>
            </form>

            {/* Autocomplete Dropdown - Categories Only */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50 p-4">
                    <div className="flex flex-wrap gap-2">
                        {results.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleSelect(cat.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors"
                            >
                                {cat.name}
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results State */}
            {isOpen && query.trim().length > 0 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border p-4 text-center z-50">
                    <p className="text-muted-foreground text-sm">No categories found for "{query}"</p>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="mt-2 text-sm text-primary hover:underline font-medium"
                    >
                        Search all services →
                    </button>
                </div>
            )}
        </div>
    );
}
