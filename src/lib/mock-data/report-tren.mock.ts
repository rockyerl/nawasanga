import type { PlanType, TrendTypes } from "@/types/features/report-tren.type";

const DATES_DAILY = ["1 Jan", "8 Jan", "15 Jan", "22 Jan", "29 Jan"] as const;
const DATES_MONTHLY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"] as const;

export const mockTrends: Record<PlanType, TrendTypes.Service.TrendData> = {
    trial: {
        emissionSeries: [
            {
                label: "Emisi",
                color: "#1D9E75",
                data: DATES_DAILY.map((date, i) => ({ date, value: +(0.9 + i * 0.1).toFixed(2) })),
            },
        ],
    },

    starter: {
        emissionSeries: [
            {
                label: "Emisi",
                color: "#1D9E75",
                data: DATES_DAILY.map((date, i) => ({
                    date,
                    value: +(1.2 + i * 0.15 - (i === 3 ? 0.2 : 0)).toFixed(2),
                })),
            },
        ],
        fuelSeries: [
            {
                label: "Konsumsi BBM",
                color: "#29A2A5",
                data: DATES_DAILY.map((date, i) => ({
                    date,
                    value: Math.round(280 + i * 30 - (i === 3 ? 40 : 0)),
                })),
            },
        ],
    },

    pro: {
        emissionSeries: [
            {
                label: "Jan 2025",
                color: "#1D9E75",
                data: DATES_DAILY.map((date, i) => ({ date, value: +(1.0 + i * 0.12).toFixed(2) })),
            },
            {
                label: "Des 2024",
                color: "#29A2A5",
                data: DATES_DAILY.map((date, i) => ({ date, value: +(1.2 + i * 0.08).toFixed(2) })),
            },
        ],
        periodComparison: [
            { label: "Total Emisi",   current: 1.5,  previous: 1.25, unit: "ton CO₂e", changePercent: 20, changeUp: true  },
            { label: "Total BBM",     current: 1200, previous: 980,  unit: "L",        changePercent: 8,  changeUp: true  },
            { label: "Avg Efisiensi", current: 8.2,  previous: 7.5,  unit: "km/L",     changePercent: 9,  changeUp: false },
        ],
        insights: [
            {
                type: "anomaly",
                title: "Anomaly Detection",
                description: "Kendaraan D naik 3x dari rata-rata 7 hari terakhir.",
                actionLabel: "Lihat Detail",
            },
            {
                type: "efficiency",
                title: "Efisiensi",
                description: "Rata-rata efisiensi 8,2 km/L. ▼ 10% dari bulan lalu.",
            },
            {
                type: "recommendation",
                title: "Rekomendasi",
                description: "Kurangi penggunaan Kendaraan B. Lakukan maintenance rutin. Optimasi rute operasional.",
            },
        ],
    },

    enterprise: {
        emissionSeries: [
            { label: "Jakarta",  color: "#1D9E75", data: DATES_DAILY.map((date, i) => ({ date, value: +(2.8 + i * 0.2).toFixed(2)  })) },
            { label: "Surabaya", color: "#29A2A5", data: DATES_DAILY.map((date, i) => ({ date, value: +(1.6 + i * 0.1).toFixed(2)  })) },
            { label: "Bali",     color: "#EF9F27", data: DATES_DAILY.map((date, i) => ({ date, value: +(1.2 + i * 0.08).toFixed(2) })) },
            { label: "Medan",    color: "#6B7280", data: DATES_DAILY.map((date, i) => ({ date, value: +(0.8 + i * 0.05).toFixed(2) })) },
        ],
        fuelSeries: [
            { label: "Jakarta",  color: "#1D9E75", data: DATES_DAILY.map((date, i) => ({ date, value: Math.round(3800 + i * 200) })) },
            { label: "Surabaya", color: "#29A2A5", data: DATES_DAILY.map((date, i) => ({ date, value: Math.round(2200 + i * 120) })) },
            { label: "Bali",     color: "#EF9F27", data: DATES_DAILY.map((date, i) => ({ date, value: Math.round(1650 + i * 90)  })) },
            { label: "Medan",    color: "#6B7280", data: DATES_DAILY.map((date, i) => ({ date, value: Math.round(1100 + i * 60)  })) },
        ],
        insights: [
            {
                type: "anomaly",
                title: "Anomaly Multi Lokasi",
                description: "Lokasi Jakarta naik 3x. Lokasi Surabaya naik 10% dari rata-rata. Cek armada bulan ini.",
                actionLabel: "Lihat Detail",
            },
            {
                type: "efficiency",
                title: "Benchmark Internal",
                description: "Jakarta: 100%, Surabaya: 95%, Bali: 80%, Medan: 110% dari target efisiensi.",
            },
            {
                type: "recommendation",
                title: "Strategi Efisiensi",
                description: "Potensi penghematan total jika rekomendasi diterapkan: optimasi rute antar lokasi, modernisasi armada, monitoring rutin per lokasi.",
            },
        ],
    },
};

export const MONTHS = DATES_MONTHLY;