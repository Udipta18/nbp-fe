import { TagSlug, tagColors, tagDisplayNames } from "@/types/tags";
import { cn } from "@/lib/utils";
import {
    ShieldCheck,
    Star,
    Clock,
    CreditCard, // Changed from Smartphone
    Truck,
    Leaf,
    Utensils, // Changed from Home
    Zap,
    Shield, // Changed from ShieldCheck
    Award, // Changed from FileBadge
    Siren, // Changed from AlertTriangle
    Stethoscope, // Changed from GraduationCap
    Smartphone, // Re-added for Video Consult
    Home,
    Activity, // Changed from HeartPulse
    Wind
} from "lucide-react";

interface TagBadgeProps {
    slug: string;
    className?: string;
    showIcon?: boolean;
}

export const tagIcons: Record<string, any> = {
    verified: ShieldCheck,
    '5_star': Star,
    '24x7': Clock,
    upi_accepted: CreditCard, // Changed from Smartphone to CreditCard for UPI
    free_delivery: Truck,
    veg_only: Leaf,
    home_cooked: Utensils, // Changed from Home to Utensils
    same_day: Zap,
    insured: Shield, // Changed from ShieldCheck to Shield
    govt_certified: Award, // Changed from FileBadge to Award
    emergency_available: Siren, // Changed from AlertTriangle
    mbbs: Stethoscope, // Changed from GraduationCap
    video_consult: Smartphone, // Changed from Video
    home_visit: Home,
    icu_equipped: Activity, // Changed from HeartPulse to Activity
    oxygen: Wind,
};

export function TagBadge({ slug, className, showIcon = true }: TagBadgeProps) {
    const colorClass = tagColors[slug] || "bg-slate-100 text-slate-700";
    const displayName = tagDisplayNames[slug] || slug.replace(/_/g, " ");
    const Icon = tagIcons[slug];

    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
            colorClass,
            className
        )}>
            {showIcon && Icon && <Icon className="w-3 h-3" />}
            {displayName}
        </span>
    );
}
