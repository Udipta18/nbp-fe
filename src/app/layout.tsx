import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: '--font-jakarta',
});

export const metadata: Metadata = {
    title: "LocalServe - Hyperlocal Services in New Barrackpur",
    description: "Find and book trusted local services including plumbers, doctors, and more in New Barrackpur.",
    manifest: "/manifest.json",
};

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${jakarta.className} antialiased bg-slate-50 relative pb-24 sm:pb-0`}>
                {children}
                <MobileBottomNav />
            </body>
        </html>
    );
}
