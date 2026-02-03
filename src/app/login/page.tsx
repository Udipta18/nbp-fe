import { LogIn, KeyRound, Sparkles } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/ComingSoonPage";

// Static features list - hoisted (rendering-hoist-jsx)
const upcomingFeatures = [
    "Phone OTP Login",
    "Booking History",
    "Saved Addresses",
    "Favorite Providers",
] as const;

function FeaturesPreview() {
    return (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg shadow-purple-100 border border-purple-100">
            <h3 className="font-semibold text-slate-800 mb-4">What&apos;s Coming:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                {upcomingFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <ComingSoonPage
            title="Login"
            subtitle="Authentication Coming Soon!"
            description="We're building a secure login system for you. Soon you'll be able to create an account, track your bookings, and manage your preferences."
            Icon={LogIn}
            BadgeIcon={KeyRound}
            gradientFrom="via-violet-50"
            gradientTo="to-purple-100"
            accentColor="text-purple-600"
        >
            <FeaturesPreview />
        </ComingSoonPage>
    );
}
