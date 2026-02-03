"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileFilterProps {
    categories: Array<{ id: string; name: string }>;
    selectedCategory?: string;
}

export function MobileFilter({ categories, selectedCategory }: MobileFilterProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                Filters
            </Button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl p-6 transition-transform duration-300 ease-out",
                open ? "translate-y-0" : "translate-y-full"
            )}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Filter by Category</h3>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                    <Link
                        href="/services"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "px-4 py-3 rounded-xl text-center font-medium transition-colors border",
                            !selectedCategory
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary hover:bg-secondary/80 border-transparent"
                        )}
                    >
                        All Services
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/services?category=${cat.id}`}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-center font-medium transition-colors border",
                                selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary hover:bg-secondary/80 border-transparent"
                            )}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
