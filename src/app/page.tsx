import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/features/SearchBar";
import { CategoryGrid } from "@/components/features/CategoryGrid";
import {
    ShieldCheck,
    Clock,
    UserCheck,
    MapPin
} from "lucide-react";
import Link from "next/link";


export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            100+ Verified Service Providers
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-gray-900">
                            Trusted Local Services in <span className="text-blue-600">New Barrackpur</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-[700px]">
                            Find trusted plumbers, doctors, electricians, and more. Book services from verified local providers instantly.
                        </p>

                        {/* Search Bar with Autocomplete */}
                        <SearchBar className="w-full max-w-sm md:max-w-xl mt-6" />
                    </div>
                </div>

                {/* Decorative bg elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-100 rounded-full blur-3xl opacity-50 -z-10" />
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Browse Categories</h2>
                            <p className="text-gray-500 mt-1">Choose from 11+ service categories</p>
                        </div>
                        <Link href="/services" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            View all →
                        </Link>
                    </div>

                    <CategoryGrid />
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-16 bg-gray-50">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose LocalServe?</h2>
                        <p className="text-gray-500 mt-2">A New Barrackpur Municipality Initiative</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-sm">
                            <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Verified Providers</h3>
                            <p className="text-gray-500 text-center">Every provider is background checked and verified by the municipality.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-sm">
                            <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
                                <Clock className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Quick Response</h3>
                            <p className="text-gray-500 text-center">Get services delivered within your selected time slot, guaranteed.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-sm">
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
                                <UserCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Fair Pricing</h3>
                            <p className="text-gray-500 text-center">Transparent pricing with no hidden charges. Pay after service.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-gradient-to-b from-white to-slate-50 pt-16 pb-12">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">LocalServe</h3>
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">New Barrackpore</p>
                                </div>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed">
                                Empowering our community by connecting residents with trusted, verified local service providers. Safe, fast, and reliable.
                            </p>
                            <div className="flex gap-4 pt-2">
                                {/* Social placeholders */}
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                    <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                    <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900">Services</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link href="/services?category=c1" className="hover:text-blue-600 transition-colors">Plumbing Service</Link></li>
                                <li><Link href="/services?category=c2" className="hover:text-blue-600 transition-colors">Electrician Help</Link></li>
                                <li><Link href="/services?category=c7" className="hover:text-blue-600 transition-colors">Ambulance (24x7)</Link></li>
                                <li><Link href="/services?category=c5" className="hover:text-blue-600 transition-colors">Doctor Consultation</Link></li>
                                <li><Link href="/services?category=c6" className="hover:text-blue-600 transition-colors">AC Repair & Service</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900">Support</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Support</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Partner with us</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© {new Date().getFullYear()} LocalServe. All rights reserved.</p>
                        <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                            <span className="text-slate-800">I</span>
                            <span className="text-red-500 text-2xl animate-pulse">❤️</span>
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">NEW BARRACKPORE</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

