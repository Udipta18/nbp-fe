"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";

interface WardSelectorProps {
    currentWard?: number;
    currentCategory?: string;
}

export function WardSelector({ currentWard, currentCategory }: WardSelectorProps) {
    const router = useRouter();

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ward = e.target.value;
        let url = '/services';
        const params = new URLSearchParams();

        if (currentCategory) params.set('category', currentCategory);
        if (ward) params.set('ward', ward);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        router.push(url);
    };

    return (
        <div className="px-3">
            <select
                value={currentWard || ""}
                onChange={handleWardChange}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-slate-300"
            >
                <option value="">All Wards</option>
                {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        Ward {i + 1}
                    </option>
                ))}
            </select>
            {currentWard && (
                <Link
                    href={`/services${currentCategory ? `?category=${currentCategory}` : ''}`}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    <X className="h-3 w-3" />
                    Clear ward filter
                </Link>
            )}
        </div>
    );
}
