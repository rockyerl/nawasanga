export type PlanType = "trial" | "starter" | "pro" | "enterprise";

export interface AssetData {
    id: string;
    name: string;
    location?: string;
    totalEmissions: number;  // ton CO₂e
    totalFuel: number;       // L
    efficiency?: number;     // km/L
    status?: "Baik" | "Perlu Perhatian" | "Kritis";
    percentage?: number;     // % dari total emisi
    rank: number;
}

export const mockAssets: Record<PlanType, AssetData[]> = {
    trial: [
        { id: "KDR-001", name: "Kendaraan A", rank: 1, totalEmissions: 0.7,  totalFuel: 480, percentage: 40 },
        { id: "KDR-002", name: "Kendaraan B", rank: 2, totalEmissions: 0.5,  totalFuel: 320, percentage: 30 },
        { id: "KDR-003", name: "Kendaraan C", rank: 3, totalEmissions: 0.3,  totalFuel: 200, percentage: 30 },
    ],
    starter: [
        { id: "KDR-001", name: "Kendaraan A", rank: 1, totalEmissions: 0.60, totalFuel: 480, percentage: 40 },
        { id: "KDR-002", name: "Kendaraan B", rank: 2, totalEmissions: 0.38, totalFuel: 320, percentage: 25 },
        { id: "KDR-003", name: "Kendaraan C", rank: 3, totalEmissions: 0.23, totalFuel: 180, percentage: 15 },
        { id: "KDR-004", name: "Kendaraan D", rank: 4, totalEmissions: 0.15, totalFuel: 100, percentage: 10 },
        { id: "KDR-005", name: "Kendaraan E", rank: 5, totalEmissions: 0.14, totalFuel: 100, percentage: 10 },
        { id: "KDR-006", name: "Kendaraan F", rank: 6, totalEmissions: 0.12, totalFuel: 90,  percentage: 8  },
        { id: "KDR-007", name: "Kendaraan G", rank: 7, totalEmissions: 0.10, totalFuel: 80,  percentage: 7  },
        { id: "KDR-008", name: "Kendaraan H", rank: 8, totalEmissions: 0.09, totalFuel: 70,  percentage: 6  },
    ],
    pro: [
        { id: "KDR-001", name: "Kendaraan A", rank: 1,  totalEmissions: 0.60, totalFuel: 480, efficiency: 10.2, status: "Baik",            percentage: 40 },
        { id: "KDR-002", name: "Kendaraan B", rank: 2,  totalEmissions: 0.38, totalFuel: 320, efficiency: 7.1,  status: "Baik",            percentage: 25 },
        { id: "KDR-003", name: "Kendaraan C", rank: 3,  totalEmissions: 0.23, totalFuel: 180, efficiency: 8.0,  status: "Baik",            percentage: 15 },
        { id: "KDR-004", name: "Kendaraan D", rank: 4,  totalEmissions: 0.15, totalFuel: 100, efficiency: 4.5,  status: "Perlu Perhatian", percentage: 10 },
        { id: "KDR-005", name: "Kendaraan E", rank: 5,  totalEmissions: 0.14, totalFuel: 100, efficiency: 8.3,  status: "Baik",            percentage: 10 },
        { id: "KDR-006", name: "Kendaraan F", rank: 6,  totalEmissions: 0.12, totalFuel: 90,  efficiency: 3.2,  status: "Kritis",          percentage: 8  },
        { id: "KDR-007", name: "Kendaraan G", rank: 7,  totalEmissions: 0.10, totalFuel: 80,  efficiency: 9.1,  status: "Baik",            percentage: 7  },
        { id: "KDR-008", name: "Kendaraan H", rank: 8,  totalEmissions: 0.09, totalFuel: 70,  efficiency: 7.8,  status: "Baik",            percentage: 6  },
        { id: "KDR-009", name: "Kendaraan I", rank: 9,  totalEmissions: 0.08, totalFuel: 60,  efficiency: 6.5,  status: "Perlu Perhatian", percentage: 5  },
        { id: "KDR-010", name: "Genset 1",    rank: 10, totalEmissions: 0.07, totalFuel: 55,  efficiency: 5.0,  status: "Baik",            percentage: 5  },
    ],
    enterprise: Array.from({ length: 20 }, (_, i) => ({
        id: `KDR-${String(i + 1).padStart(3, "0")}`,
        name: i < 15 ? `Kendaraan ${String.fromCharCode(65 + (i % 15))}` : `Genset ${i - 14}`,
        location: ["Jakarta", "Surabaya", "Bali", "Medan"][i % 4],
        rank: i + 1,
        totalEmissions: Math.round((1.20 - i * 0.04) * 100) / 100,
        totalFuel: Math.round(1200 - i * 45),
        efficiency: Math.round((10.2 - i * 0.1) * 10) / 10,
        status: (i % 5 === 3 ? "Perlu Perhatian" : i % 7 === 6 ? "Kritis" : "Baik") as AssetData["status"],
        percentage: Math.max(1, Math.round(40 - i * 1.8)),
    })),
};