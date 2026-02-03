"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingForm({ provider }: { provider: any }) {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/booking/success");
    };

    const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];

    return (
        <form onSubmit={handleBooking} className="space-y-8">

            {/* Date & Time Section */}
            <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Select Date & Time
                </h3>
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <Input
                            type="date"
                            required
                            className="w-full"
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((slot) => (
                                <div
                                    key={slot}
                                    onClick={() => setTime(slot)}
                                    className={`p-2 text-center text-sm border rounded-md cursor-pointer transition-colors ${time === slot
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "hover:bg-accent"
                                        }`}
                                >
                                    {slot}
                                </div>
                            ))}
                        </div>
                        {!time && <p className="text-xs text-red-500">Please select a time slot</p>}
                    </CardContent>
                </Card>
            </section>

            {/* Address Section */}
            <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Service Location
                </h3>
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <Input
                            placeholder="Full Name"
                            required
                            className="mb-2"
                        />
                        <Input
                            placeholder="Phone Number (+91)"
                            type="tel"
                            required
                        />
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Complete Address (Street, House No, Landmark)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </CardContent>
                </Card>
            </section>

            {/* Summary Logic */}
            <Card className="bg-slate-50 border-dashed">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Service Charge</span>
                        <span className="font-bold">₹{provider.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Booking Fee</span>
                        <span className="font-bold">₹49</span>
                    </div>
                    <div className="border-t my-2 pt-2 flex justify-between items-center">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-lg text-primary">₹{provider.price + 49}</span>
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full text-lg" disabled={loading || !time || !date}>
                {loading ? "Processing..." : "Confirm Booking"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
                Payment will be collected after service completion.
            </p>
        </form>
    );
}
