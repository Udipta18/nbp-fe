"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet"; // We can import L here because this file will be dynamically imported

// Fix for Leaflet marker icon
// We need to do this only once when the component mounts
const fixLeafletIcon = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

interface MapImplementationProps {
    center: { lat: number; lng: number };
    value?: { lat: number; lng: number };
    onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onChange }: { position: { lat: number; lng: number } | null, onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (map && center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function MapImplementation({ center, value, onChange }: MapImplementationProps) {
    useEffect(() => {
        fixLeafletIcon();
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker position={value || null} onChange={onChange} />
            <MapUpdater center={value || center} />
        </MapContainer>
    );
}
