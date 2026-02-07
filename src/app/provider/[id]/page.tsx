"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, Phone, MessageCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { providerService } from "@/lib/provider-service";
import type { Provider } from "@/types/api";

export default function ProviderDetailPage() {
    const params = useParams();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await providerService.getProviderById(params.id as string);
                if (response.success && response.data) {
                    setProvider(response.data);
                } else {
                    setError("Provider not found");
                }
            } catch (err) {
                setError("Failed to load provider");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProvider();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !provider) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">{error || "Provider not found"}</p>
                    <Link href="/services">
                        <Button>Back to Services</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Combine main image and gallery images for carousel
    const allImages = [
        ...(provider.image_url ? [provider.image_url] : []),
        ...(provider.gallery_images || [])
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/services">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <span className="font-semibold truncate">{provider.name}</span>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Image Carousel */}
                {allImages.length > 0 ? (
                    <ImageCarousel
                        images={allImages}
                        aspectRatio="aspect-[16/10]"
                        showThumbnails={allImages.length > 2}
                    />
                ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-slate-300">{provider.name.charAt(0)}</span>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8 p-4 md:p-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{provider.name}</h1>
                            <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="h-4 w-4" />
                                <span>Ward {provider.ward_number}, New Barrackpore</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                <Star className="h-4 w-4 fill-current" />
                                {provider.rating}
                            </div>
                            <span className="text-muted-foreground">{provider.review_count} Reviews</span>
                            {provider.status === 'APPROVED' && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>

                        <section>
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {provider.description || `Professional ${provider.category} service provider in New Barrackpore area.`}
                            </p>
                        </section>

                        {provider.experience_years && (
                            <section>
                                <h2 className="text-xl font-bold mb-4">Experience</h2>
                                <p className="text-muted-foreground">
                                    {provider.experience_years}+ years of professional experience
                                </p>
                            </section>
                        )}

                        <section>
                            <h2 className="text-xl font-bold mb-4">Services</h2>
                            <div className="space-y-3">
                                {['Basic Consultation', 'Standard Service', 'Emergency Service'].map((service, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span>{service}</span>
                                        </div>
                                        <span className="font-bold">₹{(provider.price || 200) + (i * 150)}</span>
                                    </div>
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
                                            <p className="text-3xl font-bold">₹{provider.price || 200}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="w-full gap-2">
                                            <MessageCircle className="h-4 w-4" /> Chat
                                        </Button>
                                        <a href={`tel:${provider.phone}`}>
                                            <Button variant="outline" className="w-full gap-2">
                                                <Phone className="h-4 w-4" /> Call
                                            </Button>
                                        </a>
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
