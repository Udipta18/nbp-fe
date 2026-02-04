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
            {/* Clean Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container px-4 py-4 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold text-xl text-blue-600">LocalServe</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-slate-600">Login</Button>
                        </Link>
                        <Link href="/providers">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Become a Provider
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Clean Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
                    <div className="sticky top-24 bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <h3 className="font-semibold text-slate-800">Categories</h3>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <Link
                                href="/services"
                                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${!selectedCategory
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                All Services
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/services?category=${cat.id}`}
                                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {cat.name}
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
