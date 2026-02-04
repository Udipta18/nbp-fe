"use client";

import { useEffect, useState } from "react";
import { Star, Clock, CheckCircle, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProviderLocation } from "@/components/features/ProviderLocation";
import { Provider } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";

function ShimmerCard() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Image Skeleton */}
            <div className="aspect-[16/9] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />
                <div className="flex gap-2">
                    <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-full w-16" />
                    <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-full w-20" />
                </div>
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-24" />
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-16" />
                        <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-24" />
                    </div>
                    <div className="h-9 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-24" />
                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
                <ShimmerCard key={i} />
            ))}
        </div>
    );
}

interface ProviderGridProps {
    category?: string;
    search?: string;
}

export function ProviderGrid({ category, search }: ProviderGridProps) {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (search) params.append('search', search);
                params.append('limit', '50');

                // Call backend directly
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
                const response = await fetch(`${apiUrl}/providers?${params.toString()}`);
                const data = await response.json();

                setProviders(data.data || []);
            } catch (error) {
                console.error("Failed to fetch providers:", error);
                setProviders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [category, search]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (providers.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No services found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters.</p>
                <Link href="/services">
                    <Button variant="outline">View All Services</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {providers.map((provider, index) => (
                    <motion.article
                        key={provider.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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

                            {/* Rating Badge */}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border border-slate-100/50">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                {provider.rating}
                            </div>

                            {/* Verified Badge */}
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
                            {provider.category && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-100 text-xs font-medium rounded-md">
                                        {provider.category}
                                    </span>
                                    {provider.experience_years && provider.experience_years > 0 && (
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100/50 text-xs font-medium rounded-md">
                                            {provider.experience_years}+ Years Exp.
                                        </span>
                                    )}
                                </div>
                            )}

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
    );
}
