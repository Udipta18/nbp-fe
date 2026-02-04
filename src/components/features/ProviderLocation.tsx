"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Provider } from "@/types/api";

export function ProviderLocation({ provider }: { provider: Provider }) {
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        // If we already have an address or city, or no coordinates, don't fetch
        if (provider.address || provider.city || !provider.latitude || !provider.longitude) {
            return;
        }

        // Fetch address from coordinates
        const fetchAddress = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${provider.latitude}&lon=${provider.longitude}`
                );
                const data = await response.json();

                if (data.address) {
                    // Try to find the most specific part of the address
                    const specific = data.address.road ||
                        data.address.pedestrian ||
                        data.address.suburb ||
                        data.address.neighbourhood ||
                        data.address.hamlet ||
                        "";

                    const cityArea = data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.county ||
                        "";

                    // Construct a cleaner address
                    let final = "";
                    if (specific && cityArea) {
                        final = `${specific}, ${cityArea}`;
                    } else {
                        final = data.display_name.split(",").slice(0, 2).join(", ");
                    }

                    setAddress(final);
                }
            } catch (error) {
                console.error("Error reverse geocoding:", error);
                // Fallback to coordinates if fetch fails, so we see SOMETHING specific
                setAddress(`${provider.latitude?.toFixed(4)}, ${provider.longitude?.toFixed(4)}`);
            }
        };

        fetchAddress();
    }, [provider.address, provider.city, provider.latitude, provider.longitude]);

    // Priority: 1. Manual Address, 2. Fetched Address, 3. Manual City, 4. Coordinates, 5. Fallback
    const displayAddress = provider.address ||
        address ||
        provider.city ||
        (provider.latitude ? `${provider.latitude}, ${provider.longitude}` : "New Barrackpore");

    // Use EXACT coordinates for the map link if available
    const mapQuery = (provider.latitude && provider.longitude)
        ? `${provider.latitude},${provider.longitude}`
        : `${displayAddress}, West Bengal`;

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    return (
        <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 flex items-center gap-1 mt-1 hover:text-blue-600 transition-colors"
        >
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{displayAddress}</span>
        </a>
    );
}
