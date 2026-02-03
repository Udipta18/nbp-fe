import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import providers from "@/data/providers.json";

export default function Dashboard() {
    // Mock bookings
    const bookings = [
        { id: 1, providerId: "p1", date: "2024-03-25", time: "10:00 AM", status: "Upcoming" },
        { id: 2, providerId: "p3", date: "2024-02-10", time: "6:00 PM", status: "Completed" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl text-primary">LocalServe</Link>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-slate-200 rounded-full" />
                        <span className="text-sm font-medium hidden sm:block">User Profile</span>
                    </div>
                </div>
            </div>

            <div className="container px-4 py-8 max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const provider = providers.find(p => p.id === booking.providerId);
                        if (!provider) return null;

                        return (
                            <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-4">

                                    {/* Image */}
                                    <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={provider.image} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg">{provider.name}</h3>
                                            <Badge variant={booking.status === "Upcoming" ? "default" : "secondary"}>
                                                {booking.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {booking.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {provider.location}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                                        {booking.status === "Upcoming" && (
                                            <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                                Cancel
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
