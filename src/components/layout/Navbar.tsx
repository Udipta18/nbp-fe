"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
            {/* Main Navbar */}
            <div className="container">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Left Logo - Text Only */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 group">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-blue-600 leading-none">LocalServe</h1>
                            <p className="text-xs text-gray-500 font-medium">New Barrackpore</p>
                        </div>
                    </Link>

                    {/* Center Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="relative group z-50">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1">
                                More <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-1 group-hover:translate-y-0">
                                <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">Admin Panel</Link>
                            </div>
                        </div>
                    </nav>

                    {/* Right Side - Auth/Menu */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/providers"
                            className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg shadow-md shadow-blue-500/20 active:scale-95"
                        >
                            Become a Provider
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg transition-all duration-300 z-40 origin-top",
                mobileMenuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
            )}>
                <nav className="container py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link href="/providers" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md">
                        Become a Provider
                    </Link>
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-amber-600 hover:bg-amber-50 rounded-md">
                        Admin Panel
                    </Link>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                        Login / Sign Up
                    </Link>
                </nav>
            </div>
        </header>
    );
}
