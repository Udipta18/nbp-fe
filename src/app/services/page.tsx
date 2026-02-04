import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";
import categories from "@/data/categories.json";
import { MobileFilter } from "@/components/features/MobileFilter";
import { ProviderGrid } from "@/components/features/ProviderGrid";

export default async function ServicesPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const params = await searchParams;
    const selectedCategory = params.category;
    const searchQuery = params.search;

    // Map category ID to name if necessary
    let filterCategory = selectedCategory;
    if (selectedCategory && selectedCategory.startsWith('c')) {
        const catObj = categories.find(c => c.id === selectedCategory);
        if (catObj) {
            filterCategory = catObj.name;
        }
    }

    const currentCategory = categories.find(c => c.id === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Classy Glassmorphic Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
                <div className="container px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-80">
                        <div className="p-1.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <ArrowLeft className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-blue-600">
                            LocalServe
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/providers">
                            <Button
                                size="sm"
                                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 border-0"
                            >
                                Become a Provider
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Clean Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
                    <div className="sticky top-24 pl-2">
                        <div className="flex items-center gap-2 mb-6 px-3">
                            <Filter className="h-4 w-4 text-blue-600" />
                            <h3 className="font-bold text-slate-800 tracking-tight text-lg">Categories</h3>
                        </div>
                        <nav className="flex flex-col gap-1.5 relative">
                            {/* Decorative line */}
                            <div className="absolute left-0 top-3 bottom-3 w-px bg-slate-200" />

                            <Link
                                href="/services"
                                className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center group rounded-r-full
                                    ${!selectedCategory
                                        ? 'text-blue-600 bg-blue-50/80 border-l-2 border-blue-600'
                                        : 'text-slate-500 hover:text-slate-900 border-l-2 border-transparent hover:border-slate-300'
                                    }`}
                            >
                                <span className={`transition-transform duration-300 ${!selectedCategory ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                    All Services
                                </span>
                            </Link>

                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/services?category=${cat.id}`}
                                    className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center group rounded-r-full
                                        ${selectedCategory === cat.id
                                            ? 'text-blue-600 bg-blue-50/80 border-l-2 border-blue-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900 border-l-2 border-transparent hover:border-slate-300'
                                        }`}
                                >
                                    <span className={`transition-transform duration-300 ${selectedCategory === cat.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Mobile Filter */}
                <div className="lg:hidden flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {currentCategory?.name || "All Services"}
                    </h2>
                    <MobileFilter categories={categories} selectedCategory={selectedCategory} />
                </div>

                {/* Provider Grid with built-in shimmer loading */}
                <main className="flex-1">
                    <ProviderGrid
                        key={`${filterCategory || 'all'}-${searchQuery || ''}`}
                        category={filterCategory}
                        search={searchQuery}
                    />
                </main>
            </div>
        </div>
    );
}
