"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { Search, Navigation, MapPin, Loader2, Sparkles, Check, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationMapProps {
    latitude?: number | null;
    longitude?: number | null;
    address?: string;
    city?: string;
    province?: string;
    onLocationSelect: (data: {
        lat: number;
        lng: number;
        address: string;
        city: string;
        province: string;
        postalCode?: string;
    }) => void;
}

interface SearchResult {
    lat: number;
    lon: number;
    name: string;
    displayName: string;
    address: string;
    city: string;
    province: string;
}

// Default center: Monas / Jakarta Pusat
const DEFAULT_LAT = -6.1754;
const DEFAULT_LNG = 106.8272;

export default function OrganizationLocationMap({
    latitude,
    longitude,
    address,
    city,
    province,
    onLocationSelect,
}: LocationMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    const [isClient, setIsClient] = useState(false);
    const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Current coordinates state
    const currentLat = latitude ?? DEFAULT_LAT;
    const currentLng = longitude ?? DEFAULT_LNG;

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Custom Sundawa Pin Icon
    const createCustomIcon = useCallback(() => {
        return L.divIcon({
            className: "custom-sundawa-pin",
            html: `
                <div style="position: relative; width: 32px; height: 42px; display: flex; flex-direction: column; align-items: center;">
                    <div style="
                        width: 32px;
                        height: 32px;
                        background: #1D6B5A;
                        border: 2.5px solid #FFFFFF;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(29, 107, 90, 0.45);
                    ">
                        <div style="
                            width: 10px;
                            height: 10px;
                            background: #D4AF5A;
                            border-radius: 50%;
                            transform: rotate(45deg);
                        "></div>
                    </div>
                    <div style="
                        width: 12px;
                        height: 4px;
                        background: rgba(0,0,0,0.25);
                        border-radius: 50%;
                        filter: blur(1.5px);
                        margin-top: 2px;
                    "></div>
                </div>
            `,
            iconSize: [32, 42],
            iconAnchor: [16, 40],
            popupAnchor: [0, -38],
        });
    }, []);

    // Perform reverse geocode from coordinates
    const handleReverseGeocode = useCallback(
        async (lat: number, lng: number) => {
            setIsLoadingGeocode(true);
            setStatusMessage("Mengambil detail alamat dari titik peta...");

            try {
                const res = await fetch(
                    `/api/internal/geocode?action=reverse&lat=${lat}&lon=${lng}`
                );
                const json = await res.json();

                if (json.code === 200 && json.data) {
                    const data = json.data;
                    onLocationSelect({
                        lat,
                        lng,
                        address: data.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                        city: data.city || "",
                        province: data.province || "",
                        postalCode: data.postalCode || "",
                    });
                    setStatusMessage(`Titik terpilih: ${data.city || data.address}`);
                    setTimeout(() => setStatusMessage(null), 3000);
                } else {
                    onLocationSelect({
                        lat,
                        lng,
                        address: address || `Titik ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                        city: city || "Jakarta",
                        province: province || "DKI Jakarta",
                    });
                }
            } catch {
                onLocationSelect({
                    lat,
                    lng,
                    address: address || `Titik ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                    city: city || "Jakarta",
                    province: province || "DKI Jakarta",
                });
            } finally {
                setIsLoadingGeocode(false);
            }
        },
        [address, city, province, onLocationSelect]
    );

    // Initialize Leaflet Map
    useEffect(() => {
        if (!isClient || !mapContainerRef.current) return;

        // Cleanup existing map instance if any
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
            center: [currentLat, currentLng],
            zoom: 14,
            zoomControl: false,
        });

        // OpenStreetMap Carto Tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        // Add zoom controls at top-right
        L.control.zoom({ position: "topright" }).addTo(map);

        // Create Marker
        const marker = L.marker([currentLat, currentLng], {
            icon: createCustomIcon(),
            draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
            const pos = marker.getLatLng();
            handleReverseGeocode(pos.lat, pos.lng);
        });

        // Click on map to tag location
        map.on("click", (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            map.panTo([lat, lng], { animate: true, duration: 0.5 });
            handleReverseGeocode(lat, lng);
        });

        mapRef.current = map;
        markerRef.current = marker;

        // Force invalidateSize after mount for correct layout in dialogs
        setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, [isClient, createCustomIcon, handleReverseGeocode]);

    // Pan map when external latitude/longitude changes (e.g. from form focus)
    useEffect(() => {
        if (!mapRef.current || !markerRef.current) return;
        if (latitude == null || longitude == null) return;

        const currentPos = markerRef.current.getLatLng();
        const dist = Math.hypot(currentPos.lat - latitude, currentPos.lng - longitude);

        // Only move if significantly different (> 10 meters) to avoid loop
        if (dist > 0.0001) {
            markerRef.current.setLatLng([latitude, longitude]);
            mapRef.current.flyTo([latitude, longitude], 15, { duration: 1 });
        }
    }, [latitude, longitude]);

    // Forward Search Handlers
    const handleSearchSubmit = async (queryText?: string) => {
        const q = queryText ?? searchQuery;
        if (!q.trim()) return;

        setIsSearching(true);
        setShowResults(true);

        try {
            const res = await fetch(
                `/api/internal/geocode?action=search&q=${encodeURIComponent(q)}`
            );
            const json = await res.json();
            if (json.code === 200 && Array.isArray(json.data)) {
                setSearchResults(json.data);
            } else {
                setSearchResults([]);
            }
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // When a search result is clicked
    const selectSearchResult = (item: SearchResult) => {
        setShowResults(false);
        setSearchQuery(item.name || item.address);

        if (mapRef.current && markerRef.current) {
            markerRef.current.setLatLng([item.lat, item.lon]);
            mapRef.current.flyTo([item.lat, item.lon], 16, { duration: 1.2 });
        }

        onLocationSelect({
            lat: item.lat,
            lng: item.lon,
            address: item.address || item.displayName,
            city: item.city || "",
            province: item.province || "",
        });

        setStatusMessage(`Lokasi difokuskan: ${item.name || item.city}`);
        setTimeout(() => setStatusMessage(null), 3000);
    };

    // Locate current user location
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Browser tidak mendukung geolokasi.");
            return;
        }

        setIsLoadingGeocode(true);
        setStatusMessage("Mendeteksi lokasi perangkat Anda...");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                if (mapRef.current && markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                    mapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
                }
                handleReverseGeocode(lat, lng);
            },
            (err) => {
                setIsLoadingGeocode(false);
                setStatusMessage(`Gagal mendeteksi lokasi: ${err.message}`);
                setTimeout(() => setStatusMessage(null), 3000);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    if (!isClient) {
        return (
            <div className="h-64 w-full rounded-xl bg-[#F7F5EF] flex items-center justify-center border border-[#EDEAE0] animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin text-[#1D6B5A]" />
                <span className="ml-2 text-xs text-[#7A7A72]">Memuat modul peta interaktif...</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Search and Action Bar */}
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7A7A72]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value.length > 2) {
                                handleSearchSubmit(e.target.value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearchSubmit();
                            }
                        }}
                        onFocus={() => {
                            if (searchResults.length > 0) setShowResults(true);
                        }}
                        placeholder="Cari gedung, jalan, atau kawasan industri..."
                        className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-[#DEDAD0] bg-[#F7F5EF] text-[#1A1A18] placeholder:text-[#7A7A72] focus:outline-none focus:border-[#1D6B5A] transition-colors"
                    />
                    {isSearching && (
                        <Loader2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 animate-spin text-[#1D6B5A]" />
                    )}

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute z-[1000] left-0 right-0 top-full mt-1 max-h-52 overflow-y-auto rounded-lg border border-[#DEDAD0] bg-white shadow-xl">
                            {searchResults.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => selectSearchResult(item)}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#F7F5EF] flex items-start gap-2 border-b border-[#F0EFEA] last:border-0 transition-colors"
                                >
                                    <MapPin className="h-3.5 w-3.5 text-[#1D6B5A] shrink-0 mt-0.5" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-[#1A1A18] truncate">
                                            {item.name || item.address}
                                        </p>
                                        <p className="text-[10px] text-[#7A7A72] truncate">
                                            {item.displayName}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* GPS Current Location Button */}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCurrentLocation}
                    title="Gunakan Lokasi GPS Saya"
                    className="h-8 px-2.5 text-xs border-[#DEDAD0] bg-[#F7F5EF] text-[#1D6B5A] hover:bg-[#EEF5F3] shrink-0 flex items-center gap-1.5"
                >
                    <Navigation className="h-3.5 w-3.5 text-[#1D6B5A]" />
                    <span className="hidden sm:inline">Lokasi Saya</span>
                </Button>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-[#DEDAD0] shadow-inner group">
                <div ref={mapContainerRef} className="w-full h-full z-0" />

                {/* Status / Loading Overlay */}
                {isLoadingGeocode && (
                    <div className="absolute top-2 left-2 z-[900] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-[#DEDAD0] flex items-center gap-2 text-[11px] text-[#1D6B5A] font-medium animate-in fade-in">
                        <Loader2 className="h-3 w-3 animate-spin text-[#1D6B5A]" />
                        <span>Mendeteksi alamat titik...</span>
                    </div>
                )}

                {statusMessage && !isLoadingGeocode && (
                    <div className="absolute top-2 left-2 z-[900] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-[#DEDAD0] flex items-center gap-2 text-[11px] text-[#1D6B5A] font-medium animate-in fade-in">
                        <Check className="h-3 w-3 text-[#2A9478]" />
                        <span>{statusMessage}</span>
                    </div>
                )}

                {/* Coordinate Badge & Interactive Hint */}
                <div className="absolute bottom-2 left-2 z-[900] flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white">
                    <Crosshair className="h-3 w-3 text-[#D4AF5A]" />
                    <span>
                        {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
                    </span>
                </div>

                <div className="absolute bottom-2 right-2 z-[900] bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-[#7A7A72] border border-[#EDEAE0] shadow-sm pointer-events-none">
                    Klik atau geser pin untuk auto-isi
                </div>
            </div>
        </div>
    );
}
