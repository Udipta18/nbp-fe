import { MessageCircle, Sparkles, Phone, Mail, MapPin } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/ComingSoonPage";

// Static contact info - hoisted outside component (rendering-hoist-jsx)
const contactInfo = [
    { icon: Phone, label: "1800-123-4567 (Toll Free)" },
    { icon: Mail, label: "support@localserve.in" },
    { icon: MapPin, label: "New Barrackpore Municipality, WB" },
] as const;

function ContactInfo() {
    return (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg shadow-green-100 border border-green-100">
            <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center justify-center gap-3 text-slate-700">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="font-medium">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <ComingSoonPage
            title="Contact Us"
            subtitle="We're Here to Help!"
            description="Full contact form coming soon! For now, reach us via phone or email. We typically respond within 24 hours."
            Icon={MessageCircle}
            BadgeIcon={Sparkles}
            gradientFrom="via-green-50"
            gradientTo="to-emerald-100"
            accentColor="text-green-600"
        >
            <ContactInfo />
        </ComingSoonPage>
    );
}
