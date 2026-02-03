import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, ArrowLeft, Search, Filter, CheckCircle } from "lucide-react";
import Link from "next/link";
import providers from "@/data/providers.json";
import categories from "@/data/categories.json";
import { MobileFilter } from "@/components/features/MobileFilter";

export default async function ServicesPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; q?: string }>;
}) {
    const params = await searchParams;
    const selectedCategory = params.category;
    const searchQuery = params.q?.toLowerCase();

    // Filter logic
    const filteredProviders = providers.filter((provider) => {
        const matchesCategory = selectedCategory ? provider.category === selectedCategory : true;
        const matchesSearch = searchQuery
            ? provider.name.toLowerCase().includes(searchQuery) || provider.tags.some(t => t.toLowerCase().includes(searchQuery))
            : true;
        return matchesCategory && matchesSearch;
    });

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

                {/* Clean Results Grid */}
                <main className="flex-1">
                    {filteredProviders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                            <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No services found</h3>
                            <p className="text-slate-500 mb-6">Try adjusting your filters.</p>
                            <Link href="/services">
                                <Button variant="outline">View All Services</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredProviders.map((provider) => (
                                <article
                                    key={provider.id}
                                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                                >
                                    {/* Simple Header */}
                                    <div className="aspect-[16/9] relative bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white/20">
                                            {categories.find(c => c.id === provider.category)?.name || "Service"}
                                        </span>
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
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.location + ", New Barrackpore, West Bengal")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-slate-500 flex items-center gap-1 mt-1 hover:text-blue-600 transition-colors"
                                        >
                                            <MapPin className="h-3 w-3" />
                                            {provider.location}
                                        </a>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {provider.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Availability */}
                                        <div className="mt-3 flex items-center gap-1.5 text-sm text-green-600">
                                            <Clock className="h-3 w-3" />
                                            Next: {provider.availability}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Starts from</p>
                                            <p className="font-bold text-lg text-slate-900">₹{provider.price}</p>
                                        </div>
                                        <Link href={`/provider/${provider.id}`}>
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                Book Now
                                            </Button>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
