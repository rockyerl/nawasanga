import { NextResponse, type NextRequest } from "next/server";

// Fallback Indonesian major cities coordinates for instant offline / network failure resilience
const INDONESIA_CITIES_FALLBACK: Record<string, { lat: number; lon: number; province: string }> = {
    "jakarta": { lat: -6.2088, lon: 106.8456, province: "DKI Jakarta" },
    "jakarta pusat": { lat: -6.1805, lon: 106.8284, province: "DKI Jakarta" },
    "jakarta selatan": { lat: -6.2615, lon: 106.8106, province: "DKI Jakarta" },
    "jakarta barat": { lat: -6.1683, lon: 106.7588, province: "DKI Jakarta" },
    "jakarta timur": { lat: -6.2250, lon: 106.9004, province: "DKI Jakarta" },
    "jakarta utara": { lat: -6.1384, lon: 106.8640, province: "DKI Jakarta" },
    "surabaya": { lat: -7.2575, lon: 112.7521, province: "Jawa Timur" },
    "bandung": { lat: -6.9175, lon: 107.6191, province: "Jawa Barat" },
    "bekasi": { lat: -6.2383, lon: 106.9756, province: "Jawa Barat" },
    "tangerang": { lat: -6.1783, lon: 106.6319, province: "Banten" },
    "tangerang selatan": { lat: -6.2885, lon: 106.7179, province: "Banten" },
    "depok": { lat: -6.4025, lon: 106.7942, province: "Jawa Barat" },
    "bogor": { lat: -6.5971, lon: 106.8060, province: "Jawa Barat" },
    "semarang": { lat: -6.9667, lon: 110.4167, province: "Jawa Tengah" },
    "solo": { lat: -7.5755, lon: 110.8243, province: "Jawa Tengah" },
    "surakarta": { lat: -7.5755, lon: 110.8243, province: "Jawa Tengah" },
    "yogyakarta": { lat: -7.7956, lon: 110.3695, province: "DI Yogyakarta" },
    "medan": { lat: 3.5952, lon: 98.6722, province: "Sumatera Utara" },
    "palembang": { lat: -2.9761, lon: 104.7754, province: "Sumatera Selatan" },
    "makassar": { lat: -5.1477, lon: 119.4327, province: "Sulawesi Selatan" },
    "balikpapan": { lat: -1.2379, lon: 116.8289, province: "Kalimantan Timur" },
    "samarinda": { lat: -0.5022, lon: 117.1536, province: "Kalimantan Timur" },
    "denpasar": { lat: -8.6705, lon: 115.2126, province: "Bali" },
    "pekanbaru": { lat: 0.5071, lon: 101.4478, province: "Riau" },
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");

        // Action 1: Reverse Geocoding (Coordinates -> Address, City, Province)
        if (action === "reverse") {
            const lat = searchParams.get("lat");
            const lon = searchParams.get("lon");

            if (!lat || !lon) {
                return NextResponse.json(
                    { code: 400, message: "Parameter 'lat' dan 'lon' wajib disertakan" },
                    { status: 400 }
                );
            }

            try {
                const osmRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
                        lat
                    )}&lon=${encodeURIComponent(lon)}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            "User-Agent": "NawasangaFuelCarbon/1.0 (contact@sundawa.id)",
                            "Accept-Language": "id,en;q=0.8",
                        },
                        signal: AbortSignal.timeout(4000),
                    }
                );

                if (osmRes.ok) {
                    const data = await osmRes.json();
                    const addr = data.address || {};

                    const road = addr.road || addr.highway || addr.pedestrian || addr.suburb || "";
                    const village = addr.village || addr.neighbourhood || addr.city_block || "";
                    const district = addr.city_district || addr.district || addr.county || "";
                    const city =
                        addr.city ||
                        addr.town ||
                        addr.municipality ||
                        addr.city_district ||
                        district ||
                        "Jakarta";
                    const province = addr.state || addr.region || "DKI Jakarta";
                    const postalCode = addr.postcode || "";

                    const formattedParts = [road, village, district].filter(Boolean);
                    const formattedAddress =
                        formattedParts.length > 0
                            ? formattedParts.join(", ")
                            : data.display_name?.split(",").slice(0, 3).join(",") || "Lokasi Ditandai";

                    let cleanCity = city.replace(/^Kota\s+/i, "").trim();
                    if (cleanCity.toLowerCase().includes("jakarta")) {
                        cleanCity = addr.city_district || "Jakarta Pusat";
                    }

                    return NextResponse.json({
                        code: 200,
                        status: "OK",
                        data: {
                            lat: parseFloat(lat),
                            lon: parseFloat(lon),
                            address: formattedAddress,
                            city: cleanCity,
                            province: province.replace(/^Propinsi\s+/i, "").replace(/^Provinsi\s+/i, "").trim(),
                            postalCode,
                            displayName: data.display_name || formattedAddress,
                        },
                    });
                }
            } catch {
                // Fallback if external API timeout or unreachable
            }

            // Return coordinate data gracefully
            return NextResponse.json({
                code: 200,
                status: "OK",
                data: {
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    address: `Titik Koordinat: ${parseFloat(lat).toFixed(5)}, ${parseFloat(lon).toFixed(5)}`,
                    city: "Jakarta Pusat",
                    province: "DKI Jakarta",
                    postalCode: "",
                    displayName: `Koordinat ${lat}, ${lon}`,
                },
            });
        }

        // Action 2: Forward Geocode / Search Query (Address/City -> Coordinates)
        if (action === "search") {
            const query = searchParams.get("q") || "";
            if (!query.trim()) {
                return NextResponse.json({ code: 200, data: [] });
            }

            try {
                const osmRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        query
                    )}&countrycodes=id&limit=6&addressdetails=1`,
                    {
                        headers: {
                            "User-Agent": "NawasangaFuelCarbon/1.0 (contact@sundawa.id)",
                            "Accept-Language": "id,en;q=0.8",
                        },
                        signal: AbortSignal.timeout(4000),
                    }
                );

                if (osmRes.ok) {
                    const items = await osmRes.json();
                    if (Array.isArray(items) && items.length > 0) {
                        const results = items.map((item) => {
                            const addr = item.address || {};
                            const road = addr.road || addr.suburb || item.name || "";
                            const city =
                                addr.city ||
                                addr.town ||
                                addr.city_district ||
                                addr.municipality ||
                                addr.county ||
                                "";
                            const province = addr.state || addr.region || "";

                            let cleanCity = city.replace(/^Kota\s+/i, "").trim();
                            if (cleanCity.toLowerCase().includes("jakarta")) {
                                cleanCity = addr.city_district || "Jakarta Pusat";
                            }

                            return {
                                lat: parseFloat(item.lat),
                                lon: parseFloat(item.lon),
                                name: item.name || road,
                                displayName: item.display_name,
                                address: road,
                                city: cleanCity,
                                province: province.replace(/^Propinsi\s+/i, "").replace(/^Provinsi\s+/i, "").trim(),
                            };
                        });
                        return NextResponse.json({ code: 200, status: "OK", data: results });
                    }
                }
            } catch {
                // Fall through to fallback
            }

            // Fallback match from local dictionary
            const qLower = query.toLowerCase().trim();
            const matchedKey = Object.keys(INDONESIA_CITIES_FALLBACK).find((k) =>
                qLower.includes(k) || k.includes(qLower)
            );

            if (matchedKey) {
                const item = INDONESIA_CITIES_FALLBACK[matchedKey];
                return NextResponse.json({
                    code: 200,
                    status: "OK",
                    data: [
                        {
                            lat: item.lat,
                            lon: item.lon,
                            name: matchedKey.toUpperCase(),
                            displayName: `${matchedKey.toUpperCase()}, ${item.province}, Indonesia`,
                            address: `Area ${matchedKey.toUpperCase()}`,
                            city: matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1),
                            province: item.province,
                        },
                    ],
                });
            }

            return NextResponse.json({ code: 200, status: "OK", data: [] });
        }

        return NextResponse.json({ code: 400, message: "Aksi tidak dikenali" }, { status: 400 });
    } catch (err) {
        return NextResponse.json(
            { code: 500, status: "Error", message: String(err) },
            { status: 500 }
        );
    }
}
