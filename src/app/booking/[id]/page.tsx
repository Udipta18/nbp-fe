import BookingForm from "@/components/features/BookingForm";
import providers from "@/data/providers.json";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function BookingPage({ params }: { params: { id: string } }) {
    const provider = providers.find(p => p.id === params.id);

    if (!provider) return notFound();

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center">Complete your Booking</h1>

                {/* Provider Summary Header */}
                <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                        <img src={provider.image} className="w-full h-full object-cover" alt={provider.name} />
                    </div>
                    <div>
                        <h3 className="font-bold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.location}</p>
                    </div>
                </div>

                <BookingForm provider={provider} />
            </div>
        </div>
    );
}
