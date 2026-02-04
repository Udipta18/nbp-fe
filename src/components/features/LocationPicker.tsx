"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import MapImplementation to avoid SSR issues with Leaflet
const MapImplementation = dynamic(
    () => import("./MapImplementation"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
);

interface LocationPickerProps {
    value?: { lat: number; lng: number };
    onChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
    const [loading, setLoading] = useState(false);
    // Default center: New Barrackpore coordinates
    const [center, setCenter] = useState({ lat: 22.6865, lng: 88.4552 });

    const handleGetCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                    onChange(latitude, longitude);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Please ensure location services are enabled.");
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                    Location Picker <span className="text-red-500">*</span>
                </label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                    Use Current Location
                </Button>
            </div>

            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-300 relative z-0">
                <MapImplementation
                    center={center}
                    value={value}
                    onChange={onChange}
                />
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {value ? (
                    <span>Selected: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}</span>
                ) : (
                    <span>Click on map to pin your business location</span>
                )}
            </div>
        </div>
    );
}
