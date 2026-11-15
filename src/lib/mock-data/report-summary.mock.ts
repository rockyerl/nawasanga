export type PlanType = "trial" | "starter" | "pro" | "enterprise";

export interface ReportData {
    id: string;
    period: string;
    totalFuel: number;
    totalEmissions: number;
    totalVehicles: number;
    totalDrivers: number;
    avgEmissions: number;
    status: "Published" | "Draft";
}

export const mockReports: Record<PlanType, ReportData[]> = {
    trial: Array.from({ length: 3 }, (_, i) => ({
        id: `RPT-${String(i + 1).padStart(4, "0")}`,
        period: `${["Jan", "Feb", "Mar"][i]} 2026`,
        totalFuel: Math.round((800 + i * 80) * 10) / 10,
        totalEmissions: Math.round((560 + i * 60) * 10) / 10,
        totalVehicles: 3,
        totalDrivers: 3,
        avgEmissions: Math.round((14 + i * 0.5) * 10) / 10,
        status: i === 2 ? "Draft" : "Published",
    })),

    starter: Array.from({ length: 6 }, (_, i) => ({
        id: `RPT-${String(i + 1).padStart(4, "0")}`,
        period: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]} 2026`,
        totalFuel: Math.round((1100 + i * 120) * 10) / 10,
        totalEmissions: Math.round((770 + i * 90) * 10) / 10,
        totalVehicles: 10,
        totalDrivers: 8 + i,
        avgEmissions: Math.round((14.2 + i * 0.6) * 10) / 10,
        status: i % 3 === 2 ? "Draft" : "Published",
    })),

    pro: Array.from({ length: 9 }, (_, i) => ({
        id: `RPT-${String(i + 1).padStart(4, "0")}`,
        period: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]} 2026`,
        totalFuel: Math.round((3200 + i * 200) * 10) / 10,
        totalEmissions: Math.round((2240 + i * 140) * 10) / 10,
        totalVehicles: 28 + i,
        totalDrivers: 20 + i * 2,
        avgEmissions: Math.round((14.8 + i * 0.4) * 10) / 10,
        status: i % 3 === 2 ? "Draft" : "Published",
    })),

    enterprise: Array.from({ length: 10 }, (_, i) => ({
        id: `RPT-${String(i + 1).padStart(4, "0")}`,
        period: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][i]} 2026`,
        totalFuel: Math.round((9800 + i * 450) * 10) / 10,
        totalEmissions: Math.round((6860 + i * 315) * 10) / 10,
        totalVehicles: 115 + i * 3,
        totalDrivers: 85 + i * 4,
        avgEmissions: Math.round((15.2 + i * 0.3) * 10) / 10,
        status: i % 4 === 3 ? "Draft" : "Published",
    })),
};