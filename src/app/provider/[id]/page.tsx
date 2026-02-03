import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import providers from "@/data/providers.json";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
    const provider = providers.find((p) => p.id === params.id);

    if (!provider) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/services">
                    <Button variant="ghost" size="sm">← Back</Button>
                </Link>
                <span className="font-semibold truncate">{provider.name}</span>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Cover Image */}
                <div className="h-64 md:h-80 w-full relative bg-slate-100">
                    <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 md:left-8 text-white">
                        <h1 className="text-3xl font-bold">{provider.name}</h1>
                        <div className="flex items-center gap-2 mt-2 text-white/90">
                            <MapPin className="h-4 w-4" /> {provider.location}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 p-4 md:p-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                <Star className="h-4 w-4 fill-current" />
                                {provider.rating}
                            </div>
                            <span className="text-muted-foreground">{provider.reviewCount} Reviews</span>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                                <Clock className="h-4 w-4" />
                                Available {provider.availability}
                            </div>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Professional service provider with over 5 years of experience in New Barrackpur area.
                                Dedicated to quality work and customer satisfaction. Fully vaccinated staff and follows all safety protocols.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Services</h2>
                            <div className="space-y-3">
                                {['Basic Consultation/Visit', 'Standard Service', 'Emergency Service'].map((service, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span>{service}</span>
                                        </div>
                                        <span className="font-bold">₹{provider.price + (i * 150)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Reviews</h2>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <Card key={i} className="bg-secondary/10 border-none">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-8 w-8 rounded-full bg-slate-300" />
                                                <div>
                                                    <p className="text-sm font-bold">Rahul Das</p>
                                                    <p className="text-xs text-muted-foreground">2 days ago</p>
                                                </div>
                                                <div className="ml-auto flex text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700">Very professional and punctual. Did the job perfectly.</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Booking Card */}
                    <div className="relative">
                        <div className="sticky top-24">
                            <Card className="border shadow-lg">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Price starts at</p>
                                            <p className="text-3xl font-bold">₹{provider.price}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="w-full gap-2">
                                            <MessageCircle className="h-4 w-4" /> Chat
                                        </Button>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Phone className="h-4 w-4" /> Call
                                        </Button>
                                    </div>

                                    <Link href={`/booking/${provider.id}`} className="block">
                                        <Button className="w-full" size="lg">Book Appointment</Button>
                                    </Link>

                                    <p className="text-xs text-center text-muted-foreground">
                                        Free cancellation up to 2 hours before
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
