"use client";

import { useState } from "react";
import { Star, CheckCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProviderLocation } from "@/components/features/ProviderLocation";
import { Provider } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";
import { TagBadge, tagIcons } from "@/components/ui/TagBadge";
import { useQuery } from "@tanstack/react-query";
import { universalTags, tagsByCategory, tagDisplayNames } from "@/types/tags";

// --- Components ---

function ShimmerCard() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="aspect-[16/9] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-100 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-slate-100 animate-pulse rounded w-1/2" />
                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-full" />
                    <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-full" />
                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <ShimmerCard key={i} />)}
        </div>
    );
}

interface ProviderGridProps {
    category?: string;
    search?: string;
    ward?: number;
}

// --- Fetchers ---

async function fetchTagsFromApi(category?: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${apiUrl}/providers/tags${params}`);
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json();
}

async function fetchProvidersFromApi(params: Record<string, string>) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const searchParams = new URLSearchParams(params);
    searchParams.append('limit', '50');

    try {
        const res = await fetch(`${apiUrl}/providers?${searchParams.toString()}`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || `API Error ${res.status}`);
        }
        return res.json();
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}

// --- Main Component ---

export function ProviderGrid({ category, search, ward }: ProviderGridProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 1. Tags Query
    const { data: tagsData } = useQuery({
        queryKey: ['tags', category],
        queryFn: () => fetchTagsFromApi(category),
        // Retry only once for tags, fallback quickly if backend down
        retry: 1,
        // We use select to format data or fallback to static
    });

    // Compute display tags (API + Fallback + Strict Filtering)
    const availableFilterTags = (() => {
        // Correct logic: If no category, show ONLY universal tags
        const isUniversalMode = !category || !tagsByCategory[category];
        const allowedSlugs = isUniversalMode ? universalTags : tagsByCategory[category];

        // If API returned valid data, use it but filter it
        if (tagsData?.success && Array.isArray(tagsData.data)) {
            const apiTags = tagsData.data.filter((t: any) => allowedSlugs.includes(t.slug));
            if (apiTags.length > 0) {
                // FORCE: Use our classy frontend names over API names
                return apiTags.map((t: any) => ({
                    ...t,
                    display_name: tagDisplayNames[t.slug] || t.display_name
                }));
            }
        }

        // Fallback to static data
        return allowedSlugs.map(slug => ({
            slug,
            display_name: tagDisplayNames[slug] || slug
        }));
    })();

    // 2. Providers Query
    const { data: providersData, isLoading: loading, isError } = useQuery({
        queryKey: ['providers', category, search, ward, selectedTags],
        queryFn: () => {
            const params: Record<string, string> = {};
            if (category) params['category'] = category;
            if (search) params['search'] = search;
            if (ward) params['ward'] = ward.toString();
            if (selectedTags.length > 0) params['tags'] = selectedTags.join(',');
            return fetchProvidersFromApi(params);
        },
        staleTime: 30000,
        retry: false,
    });

    const providers: Provider[] = providersData?.data || [];

    const toggleTag = (slug: string) => {
        setSelectedTags(prev =>
            prev.includes(slug) ? prev.filter(t => t !== slug) : [...prev, slug]
        );
    };

    // --- Render ---

    return (
        <div className="space-y-6">
            {/* Quick Filters - Only show when a specific category is selected */}
            {category && availableFilterTags.length > 0 && (
                <div
                    className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 select-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* CSS to hide scrollbar for Webkit */}
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Reset Button - FIRST for mobile accessibility */}
                    {selectedTags.length > 0 && (
                        <button
                            onClick={() => setSelectedTags([])}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors shrink-0"
                        >
                            <span className="w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full font-bold">
                                {selectedTags.length}
                            </span>
                            Clear
                        </button>
                    )}

                    {selectedTags.length > 0 && (
                        <div className="h-5 w-px bg-slate-200 shrink-0" />
                    )}

                    {availableFilterTags.map((tag: { slug: string, display_name: string }) => {
                        const isSelected = selectedTags.includes(tag.slug);
                        const Icon = tagIcons[tag.slug];
                        return (
                            <button
                                key={tag.slug}
                                onClick={() => toggleTag(tag.slug)}
                                className={`
                                    group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0
                                    ${isSelected
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 scale-100'
                                        : 'bg-white border border-slate-100 text-slate-500 shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-blue-100 hover:text-blue-600 hover:-translate-y-0.5'}
                                `}
                            >
                                {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />}
                                {tag.display_name}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSkeleton />
            ) : providers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                    <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No services found</h3>
                    <p className="text-slate-500 mb-6">Try adjusting your filters.</p>
                    <div className="flex justify-center gap-3">
                        {ward && (
                            <Link href={`/services${category ? `?category=${category}` : ''}${search ? `${category ? '&' : '?'}search=${search}` : ''}`}>
                                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                                    Search in All Wards
                                </Button>
                            </Link>
                        )}
                        <Link href="/services">
                            <Button variant="outline">View All Services</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {providers.map((provider, index) => (
                            <motion.article
                                key={provider.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Provider Image */}
                                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                                    {provider.image_url ? (
                                        <img
                                            src={provider.image_url}
                                            alt={provider.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                                            <span className="text-4xl font-bold text-slate-300 relative z-10">
                                                {provider.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border border-slate-100/50">
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                        {provider.rating}
                                    </div>

                                    {/* Verified */}
                                    {provider.is_verified && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm border border-slate-100/50">
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-lg text-slate-800 truncate mb-1 group-hover:text-blue-600 transition-colors">
                                            {provider.name}
                                        </h3>
                                        <ProviderLocation provider={provider} />
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {provider.category && (
                                            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-100 text-xs font-medium rounded-md">
                                                {provider.category}
                                            </span>
                                        )}

                                        {provider.tags?.map(tag => (
                                            <TagBadge key={tag} slug={tag} />
                                        ))}

                                        {provider.experience_years && provider.experience_years > 0 && (
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100/50 text-xs font-medium rounded-md">
                                                {provider.experience_years}+ Years Exp.
                                            </span>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Starts from</p>
                                            <p className="font-bold text-slate-900">
                                                {provider.price ? `₹${provider.price}` : "Ask Price"}
                                            </p>
                                        </div>
                                        <Link href={`/booking/${provider.id}`}>
                                            <Button size="sm" className="bg-slate-900 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 shadow-md shadow-slate-200">
                                                Book Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
