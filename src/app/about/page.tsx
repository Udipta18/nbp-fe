import { Construction, Sparkles } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/ComingSoonPage";

// Static progress component - hoisted (rendering-hoist-jsx)
function ProgressIndicator() {
    return (
        <div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-2">
                <span>Progress</span>
                <span className="font-semibold text-blue-600">75%</span>
            </div>
            <div className="w-64 mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>
        </div>
    );
}

export default function AboutPage() {
    return (
        <ComingSoonPage
            title="About Us"
            subtitle="Coming Soon!"
            description="We're crafting something amazing to share our story with you. Learn about the New Barrackpore Municipality's vision for connecting residents with trusted local service providers."
            Icon={Construction}
            BadgeIcon={Sparkles}
            gradientFrom="via-blue-50"
            gradientTo="to-indigo-100"
            accentColor="text-blue-600"
        >
            <ProgressIndicator />
        </ComingSoonPage>
    );
}
