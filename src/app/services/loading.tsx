import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

function ShimmerCard() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-[16/9] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Name */}
                <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />

                {/* Location */}
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />

                {/* Tags */}
                <div className="flex gap-2">
                    <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-full w-16" />
                    <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-full w-20" />
                </div>

                {/* Availability */}
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-24" />

                {/* Price Section */}
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

function SidebarSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-lg"
                />
            ))}
        </div>
    );
}

export default function ServicesLoading() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold text-xl text-blue-600">LocalServe</span>
                    </Link>
                </div>
            </header>

            <div className="container px-4 py-6 flex gap-6">
                {/* Sidebar Skeleton */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <span className="font-semibold text-slate-800">Categories</span>
                        </div>
                        <SidebarSkeleton />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-7 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded w-32" />
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <ShimmerCard key={i} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
