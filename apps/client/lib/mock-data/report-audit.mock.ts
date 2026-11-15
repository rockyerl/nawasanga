import type { PlanType, AuditTypes } from "@/types/features/report-audit.type";

export const mockAudit: Record<PlanType, AuditTypes.Service.AuditData> = {
    trial: {
        insights: [],
    },

    starter: {
        insights: [],
    },

    pro: {
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
            {
                type: "recommendation",
                title: "Rekomendasi Strategis",
                description: "Lokasi Jakarta naik 30%. Bali paling efisien. Potensi efisiensi total 20%.",
            },
        ],
        benchmarks: [
            { location: "Jakarta",  color: "#1D9E75", percent: 100 },
            { location: "Surabaya", color: "#29A2A5", percent: 95  },
            { location: "Bali",     color: "#EF9F27", percent: 80  },
            { location: "Medan",    color: "#EF4444", percent: 110 },
        ],
        auditReport: {
            period: "Januari 2025",
            totalEmission: 12.5,
            breakdown: [
                { label: "Kendaraan", color: "#1D9E75", tonCO2e: 6.4, percent: 76 },
                { label: "Genset",    color: "#29A2A5", tonCO2e: 2.6, percent: 21 },
                { label: "Lainnya",   color: "#EF9F27", tonCO2e: 0.6, percent: 5  },
            ],
            methodology: {
                standard:       "IPCC 2006",
                scope:          "Scope 1",
                emissionFactor: "Kementerian ESDM",
                calculation:    "Otomatis oleh Sistem",
            },
            downloadLabel: "Unduh Laporan PDF",
        },
    },
};