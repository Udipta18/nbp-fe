"use client";

import { useEffect, useState } from "react";
import { Star, Clock, CheckCircle, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { providerService } from "@/lib/provider-service";
import { ProviderLocation } from "@/components/features/ProviderLocation";
import { Provider } from "@/types/api";

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

                const response = await fetch(`/api/providers?${params.toString()}`);
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
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {providers.map((provider) => (
                <article
                    key={provider.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                    {/* Provider Image */}
                    <div className="aspect-[16/9] relative bg-slate-100">
                        {provider.image_url ? (
                            <img
                                src={provider.image_url}
                                alt={provider.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span className="text-4xl text-blue-400">
                                    {provider.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        {/* Rating */}
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {provider.rating}
                        </div>
                        {/* Verified */}
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-semibold text-slate-900 truncate">
                            {provider.name}
                        </h3>
                        <ProviderLocation provider={provider} />

                        {/* Tags */}
                        {provider.category && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    {provider.category}
                                </span>
                                {provider.experience_years && provider.experience_years > 0 && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                                        {provider.experience_years} Years Exp.
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Availability */}
                        <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
                            <Clock className="h-3 w-3" />
                            Available Now
                        </div>

                        {/* Price */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Starts from</p>
                                <p className="font-bold text-slate-900">
                                    {provider.price ? `₹${provider.price}` : "Contact for Price"}
                                </p>
                            </div>
                            <Link href={`/booking/${provider.id}`}>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Book Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
