export type PlanType = "trial" | "starter" | "pro" | "enterprise";

export interface StatCard {
    label: string;
    value: string;
    unit?: string;
    trend: string;
    trendUp: boolean;
    comparison: string;
    barColor: string;
    barWidth: string;
}

export interface EmissionsDataPoint {
    day: string;
    value: number;
    // Pro & Enterprise: per-category / per-location
    genset?: number;
    alatBerat?: number;
    surabaya?: number;
    bali?: number;
    balikpapan?: number;
}

export interface TopEmitter {
    name: string;
    value: string;
    unit: string;
    pct: number;
}

export interface AssetRow {
    name: string;
    location?: string; // Enterprise only
    kategori: string;
    konsumsi: number;
    emisi: number;
    efisiensi?: number;
    trend?: "up" | "down" | "flat"; // Pro+
    status: "Aktif" | "Non-Aktif";
}

export interface InsightBox {
    type: "info" | "warning" | "success";
    title: string;
    body: string;
    linkLabel?: string;
}

export interface LocationBar {
    city: string;
    value: number;
}

export interface PerformanceCategory {
    name: string;
    pct: number;
    color: string;
}

// ─── TRIAL ────────────────────────────────────────────────────────────────────
export const trialStatCards: StatCard[] = [
    { label: "Total Emisi",    value: "1.25", unit: "ton CO₂e", trend: "↑ 12%", trendUp: true,  comparison: "vs Mar 2025", barColor: "#1D9E75", barWidth: "42%" },
    { label: "Konsumsi BBM",   value: "426",  unit: "Liter",    trend: "↑ 8%",  trendUp: true,  comparison: "vs Mar 2025", barColor: "#29A2A5", barWidth: "55%" },
    { label: "Asset",          value: "3/3",  unit: "Maksimal", trend: "",       trendUp: false, comparison: "",            barColor: "#E24B4A", barWidth: "100%" },
    { label: "Efisiensi",      value: "7.8",  unit: "km/l",     trend: "↓ 5%",  trendUp: false, comparison: "vs Mar 2025", barColor: "#EF9F27", barWidth: "65%" },
];

export const trialEmissionsData: EmissionsDataPoint[] = [
    { day: "1 Apr",  value: 0.8 },
    { day: "8 Apr",  value: 0.9 },
    { day: "15 Apr", value: 1.1 },
    { day: "22 Apr", value: 1.4 },
    { day: "30 Apr", value: 1.25 },
];

export const trialTopEmitters: TopEmitter[] = [
    { name: "Kendaraan A", value: "0.75", unit: "ton CO₂e", pct: 60 },
    { name: "Kendaraan B", value: "0.50", unit: "ton CO₂e", pct: 40 },
];

export const trialAssets: AssetRow[] = [
    { name: "Kendaraan A", kategori: "Kendaraan", konsumsi: 240, emisi: 0.75, status: "Aktif" },
    { name: "Kendaraan B", kategori: "Kendaraan", konsumsi: 150, emisi: 0.50, status: "Aktif" },
    { name: "Genset 1",    kategori: "Genset",    konsumsi: 36,  emisi: 0.20, status: "Aktif" },
];

export const trialDaysLeft = 14;

// ─── STARTER ──────────────────────────────────────────────────────────────────
export const starterStatCards: StatCard[] = [
    { label: "Total Emisi",  value: "3.45",  unit: "ton CO₂e", trend: "↑ 19%", trendUp: true,  comparison: "vs Mar 2025", barColor: "#1D9E75", barWidth: "58%" },
    { label: "Konsumsi BBM", value: "1.245", unit: "Liter",    trend: "↑ 15%", trendUp: true,  comparison: "vs Mar 2025", barColor: "#29A2A5", barWidth: "62%" },
    { label: "Asset",        value: "8/10",  unit: "Digunakan",trend: "",       trendUp: false, comparison: "",            barColor: "#29A2A5", barWidth: "80%" },
    { label: "Efisiensi",    value: "8.2",   unit: "km/l",     trend: "↓ 3%",  trendUp: false, comparison: "vs Mar 2025", barColor: "#EF9F27", barWidth: "68%" },
];

export const starterEmissionsData: EmissionsDataPoint[] = [
    { day: "1 Apr",  value: 1.8 },
    { day: "8 Apr",  value: 2.2 },
    { day: "15 Apr", value: 2.8 },
    { day: "22 Apr", value: 3.6 },
    { day: "30 Apr", value: 3.45 },
];

export const starterTopEmitters: TopEmitter[] = [
    { name: "Kendaraan A", value: "1.20", unit: "ton CO₂e", pct: 35 },
    { name: "Kendaraan B", value: "0.85", unit: "ton CO₂e", pct: 25 },
    { name: "Genset 1",    value: "0.60", unit: "ton CO₂e", pct: 17 },
    { name: "Kendaraan C", value: "0.45", unit: "ton CO₂e", pct: 13 },
    { name: "Genset 2",    value: "0.35", unit: "ton CO₂e", pct: 10 },
];

export const starterAssets: AssetRow[] = [
    { name: "Kendaraan A", kategori: "Kendaraan", konsumsi: 420, emisi: 1.20, efisiensi: 7.1, status: "Aktif" },
    { name: "Kendaraan B", kategori: "Kendaraan", konsumsi: 300, emisi: 0.85, efisiensi: 6.8, status: "Aktif" },
    { name: "Genset 1",    kategori: "Genset",    konsumsi: 180, emisi: 0.60, status: "Aktif" },
];

export const starterAssetUsage = { used: 8, total: 10 };

// ─── PRO ──────────────────────────────────────────────────────────────────────
export const proStatCards: StatCard[] = [
    { label: "Total Emisi",  value: "8.62",  unit: "ton CO₂e", trend: "↓ 22%", trendUp: false, comparison: "vs Mar 2025", barColor: "#1D9E75", barWidth: "72%" },
    { label: "Konsumsi BBM", value: "3.150", unit: "Liter",    trend: "↑ 18%", trendUp: true,  comparison: "vs Mar 2025", barColor: "#29A2A5", barWidth: "78%" },
    { label: "Asset",        value: "25/30", unit: "Digunakan",trend: "",       trendUp: false, comparison: "",            barColor: "#29A2A5", barWidth: "83%" },
    { label: "Efisiensi",    value: "9.3",   unit: "km/l",     trend: "↓ 6%",  trendUp: false, comparison: "vs Mar 2025", barColor: "#EF9F27", barWidth: "77%" },
];

export const proEmissionsData: EmissionsDataPoint[] = [
    { day: "1 Apr",  value: 3,   genset: 1.5, alatBerat: 0.5 },
    { day: "8 Apr",  value: 4,   genset: 2.0, alatBerat: 0.8 },
    { day: "15 Apr", value: 5,   genset: 2.5, alatBerat: 1.0 },
    { day: "22 Apr", value: 6,   genset: 2.0, alatBerat: 1.2 },
    { day: "30 Apr", value: 5.5, genset: 1.8, alatBerat: 1.3 },
];

export const proTopEmitters: TopEmitter[] = [
    { name: "Kendaraan A",  value: "2.90", unit: "ton CO₂e", pct: 34 },
    { name: "Kendaraan B",  value: "1.80", unit: "ton CO₂e", pct: 21 },
    { name: "Genset 1",     value: "0.95", unit: "ton CO₂e", pct: 11 },
    { name: "Alat Berat 1", value: "0.95", unit: "ton CO₂e", pct: 11 },
    { name: "Kendaraan C",  value: "0.76", unit: "ton CO₂e", pct: 9  },
];

export const proInsights: InsightBox[] = [
    { type: "info",    title: "Insight Utama",       body: "Emisi naik 20% dari bulan lalu. Faktor: peningkatan konsumsi kendaraan. Emisi naik 2× dalam 7 hari terakhir.", linkLabel: "Lihat Detail" },
    { type: "warning", title: "Anomali Terdeteksi",  body: "Emisi Genset 1 naik 30% dari bulan lalu.",                                                                      linkLabel: "Lihat Detail" },
    { type: "success", title: "Rekomendasi",         body: "Optimasi rute pada Kendaraan A. Potensi penghematan 18% emisi.",                                                linkLabel: "Lihat Detail" },
];

export const proAssets: AssetRow[] = [
    { name: "Kendaraan A", kategori: "Kendaraan", konsumsi: 920, emisi: 8.1,  efisiensi: 7.8, trend: "up",   status: "Aktif" },
    { name: "Kendaraan B", kategori: "Kendaraan", konsumsi: 610, emisi: 1.80, efisiensi: 6.4, trend: "down", status: "Aktif" },
    { name: "Genset 1",    kategori: "Genset",    konsumsi: 420, emisi: 1.20,                  trend: "flat", status: "Aktif" },
];

// ─── ENTERPRISE ───────────────────────────────────────────────────────────────
export const enterpriseStatCards: StatCard[] = [
    { label: "Total Emisi",    value: "24.75", unit: "ton CO₂e", trend: "↑ 18%", trendUp: true,  comparison: "vs Mar 2025", barColor: "#1D9E75", barWidth: "82%" },
    { label: "Konsumsi BBM",   value: "8.920", unit: "Liter",    trend: "↑ 17%", trendUp: true,  comparison: "vs Mar 2025", barColor: "#29A2A5", barWidth: "78%" },
    { label: "Asset",          value: "120",   unit: "/ 150+",   trend: "",       trendUp: false, comparison: "",            barColor: "#29A2A5", barWidth: "80%" },
    { label: "Efisiensi Global", value: "10.2", unit: "km/l",    trend: "↓ 4%",  trendUp: false, comparison: "vs Mar 2025", barColor: "#EF9F27", barWidth: "85%" },
    { label: "Lokasi Aktif",   value: "6",     unit: "Lokasi",   trend: "+1",     trendUp: true,  comparison: "baru bulan ini", barColor: "#6366f1", barWidth: "60%" },
];

export const enterpriseEmissionsData: EmissionsDataPoint[] = [
    { day: "1 Apr",  value: 8,  surabaya: 4,   bali: 2,   balikpapan: 1.5 },
    { day: "8 Apr",  value: 10, surabaya: 5,   bali: 2.5, balikpapan: 2   },
    { day: "15 Apr", value: 12, surabaya: 5.5, bali: 3,   balikpapan: 2.2 },
    { day: "22 Apr", value: 14, surabaya: 6,   bali: 3.2, balikpapan: 2.8 },
    { day: "30 Apr", value: 13, surabaya: 5.8, bali: 3,   balikpapan: 2.5 },
];

export const enterpriseLocationBars: LocationBar[] = [
    { city: "Jakarta",     value: 5.2 },
    { city: "Surabaya",   value: 3.1 },
    { city: "Bali",       value: 4.2 },
    { city: "Balikpapan", value: 2.8 },
    { city: "Medan",      value: 5.8 },
    { city: "Semarang",   value: 3.6 },
];

export const enterprisePerformanceCategories: PerformanceCategory[] = [
    { name: "Kendaraan",  pct: 60, color: "#1D9E75" },
    { name: "Genset",     pct: 25, color: "#29A2A5" },
    { name: "Alat Berat", pct: 10, color: "#EF9F27" },
    { name: "Lainnya",    pct: 5,  color: "#888780" },
];

export const enterpriseInsights: InsightBox[] = [
    { type: "info",    title: "Insight Strategis",  body: "Jakarta menyumbang emisi terbesar (27%). Potensi penghematan total 20% dengan optimasi rute dan idle time. 2 lokasi paling efisien ditandai.", linkLabel: "Lihat Analisis Lengkap" },
    { type: "warning", title: "Peringatan",         body: "3 Asset perlu perhatian. 2 lokasi mengalami kenaikan signifikan.",                                                                               linkLabel: "Lihat Semua" },
];

export const enterpriseAssets: AssetRow[] = [
    { name: "Kendaraan A",  location: "Jakarta",    kategori: "Kendaraan", konsumsi: 1250, emisi: 3.20, efisiensi: 9.1, status: "Aktif" },
    { name: "Kendaraan B",  location: "Surabaya",   kategori: "Kendaraan", konsumsi: 980,  emisi: 2.10, status: "Aktif" },
    { name: "Genset 2",     location: "Bali",       kategori: "Genset",    konsumsi: 850,  emisi: 1.80, status: "Aktif" },
    { name: "Alat Berat 1", location: "Balikpapan", kategori: "Alat Berat",konsumsi: 740,  emisi: 1.55, status: "Aktif" },
];