import { Briefcase, Sparkles, CheckCircle } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/ComingSoonPage";

// Static benefits list - hoisted (rendering-hoist-jsx)
const providerBenefits = [
    "Free registration & listing",
    "Direct customer bookings",
    "Municipality verified badge",
    "No commission on first 50 bookings",
] as const;

function BenefitsPreview() {
    return (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg shadow-orange-100 border border-orange-100">
            <h3 className="font-semibold text-slate-800 mb-4">Provider Benefits:</h3>
            <div className="space-y-3 text-left">
                {providerBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 text-slate-700">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProvidersPage() {
    return (
        <ComingSoonPage
            title="Become a Provider"
            subtitle="Partner Registration Opening Soon!"
            description="Join LocalServe as a verified service provider and grow your business. Connect with thousands of customers in New Barrackpore."
            Icon={Briefcase}
            BadgeIcon={Sparkles}
            gradientFrom="via-orange-50"
            gradientTo="to-amber-100"
            accentColor="text-orange-600"
        >
            <BenefitsPreview />
        </ComingSoonPage>
    );
}
