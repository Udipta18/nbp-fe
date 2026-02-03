import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
            <div className="bg-green-100 text-green-600 p-6 rounded-full mb-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground max-w-sm mb-8">
                Your service request has been sent to the provider. You will receive a confirmation via WhatsApp shortly.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Link href="/dashboard">
                    <Button className="w-full" variant="outline">View My Bookings</Button>
                </Link>
                <Link href="/">
                    <Button className="w-full">Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}
