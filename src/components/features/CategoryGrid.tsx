"use client";

import Link from "next/link";
import {
    Wrench,
    Zap,
    Sparkles,
    Paintbrush,
    Stethoscope,
    ThermometerSnowflake,
    Ambulance,
    Car,
    Droplets,
    Pill,
    ShoppingCart,
    ChefHat,
    Scissors,
    Smartphone,
    Truck
} from "lucide-react";
import categories from "@/data/categories.json";

// Map string icon names to components
const iconMap: Record<string, any> = {
    Wrench,
    Zap,
    Sparkles,
    Paintbrush,
    Stethoscope,
    ThermometerSnowflake,
    Ambulance,
    Car,
    Droplets,
    Pill,
    ShoppingCart,
    ChefHat,
    Scissors,
    Smartphone,
    Truck
};

// Explicit color map to ensure Tailwind generates these classes
const colorMap: Record<string, string> = {
    "c1": "bg-blue-100 text-blue-600",
    "c2": "bg-yellow-100 text-yellow-600",
    "c3": "bg-purple-100 text-purple-600",
    "c4": "bg-pink-100 text-pink-600",
    "c5": "bg-green-100 text-green-600",
    "c6": "bg-cyan-100 text-cyan-600",
    "c7": "bg-red-100 text-red-600",
    "c8": "bg-slate-100 text-slate-600",
    "c9": "bg-sky-100 text-sky-600",
    "c10": "bg-emerald-100 text-emerald-600",
    "c11": "bg-orange-100 text-orange-600"
};

export function CategoryGrid() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Wrench;
                // fallback to cat.color if ID not found, but prefer colorMap for Tailwind safety
                const colorClass = colorMap[cat.id] || "bg-gray-100 text-gray-600";

                return (
                    <Link href={`/services?category=${cat.id}`} key={cat.id} scroll={true}>
                        <div className="h-full cursor-pointer bg-white rounded-xl border border-slate-100/80 shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:-translate-y-1">
                            <div className="flex flex-col items-center justify-center p-6 gap-3 text-center h-full">
                                <div className={`p-4 rounded-full ${colorClass}`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                <span className="font-semibold text-sm text-slate-700">{cat.name}</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
