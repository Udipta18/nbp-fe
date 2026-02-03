import Link from "next/link";
import { ArrowLeft, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Static footer text - hoisted outside component (rendering-hoist-jsx)
const currentYear = new Date().getFullYear();

interface ComingSoonPageProps {
    title: string;
    subtitle: string;
    description: string;
    Icon: LucideIcon;
    BadgeIcon: LucideIcon;
    gradientFrom: string;
    gradientTo: string;
    accentColor: string;
    children?: React.ReactNode;
}

export function ComingSoonPage({
    title,
    subtitle,
    description,
    Icon,
    BadgeIcon,
    gradientFrom,
    gradientTo,
    accentColor,
    children,
}: ComingSoonPageProps) {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 ${gradientFrom} ${gradientTo} flex flex-col`}>
            {/* Header */}
            <header className="p-4 border-b bg-white/50 backdrop-blur-sm">
                <div className="container flex items-center gap-4">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 text-slate-700 hover:${accentColor} transition-colors`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-lg">
                    {/* Animated Icon */}
                    <div className="relative inline-flex mb-8">
                        <div className={`absolute inset-0 ${accentColor.replace('text-', 'bg-').replace('-600', '-400')} rounded-full blur-2xl opacity-20 animate-pulse`} />
                        <div className={`relative p-6 bg-gradient-to-br ${accentColor.replace('text-', 'from-').replace('-600', '-500')} ${accentColor.replace('text-', 'to-').replace('-600', '-600')} rounded-3xl shadow-xl ${accentColor.replace('text-', 'shadow-').replace('-600', '-200')}`}>
                            <Icon className="h-16 w-16 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full shadow-lg">
                            <BadgeIcon className="h-4 w-4 text-yellow-800" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        {title}
                    </h1>
                    <p className={`text-xl ${accentColor} font-semibold mb-6`}>
                        {subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">
                        {description}
                    </p>

                    {/* Custom Content Slot */}
                    {children ? (
                        <div className="mb-8">{children}</div>
                    ) : null}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button
                                size="lg"
                                className={`gap-2 px-8 ${accentColor.replace('text-', 'bg-').replace('-600', '-600')} ${accentColor.replace('text-', 'hover:bg-').replace('-600', '-700')}`}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button variant="outline" size="lg" className="px-8">
                                Browse Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-sm text-slate-500">
                <p>© {currentYear} LocalServe • New Barrackpore Municipality</p>
            </footer>
        </div>
    );
}
