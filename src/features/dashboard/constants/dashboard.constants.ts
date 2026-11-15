import type { DashboardTypes } from "@/types/features/dashboard.type";

export type PlanType = DashboardTypes.PlanType;
export type StatCard = DashboardTypes.StatCard;
export type TopEmitter = DashboardTypes.TopEmitter;
export type AssetRow = DashboardTypes.AssetRow;
export type InsightBox = {
  type: "info" | "warning" | "success";
  title: string;
  body: string;
  linkLabel?: string;
};

export interface LocationBar {
  city: string;
  value: number;
}

export interface PerformanceCategory {
  name: string;
  pct: number;
  color: string;
}

// Baseline data per tier
export const trialStatCards: StatCard[] = [
  { label: "Total Emisi", value: "1.25", unit: "ton CO₂e", trend: "↑ 12%", trendUp: true, comparison: "vs baseline", barColor: "#1D9E75", barWidth: "42%" },
  { label: "Konsumsi BBM", value: "426", unit: "Liter", trend: "↑ 8%", trendUp: true, comparison: "vs baseline", barColor: "#29A2A5", barWidth: "55%" },
  { label: "Asset", value: "3/3", unit: "Maksimal", trend: "", trendUp: false, comparison: "", barColor: "#E24B4A", barWidth: "100%" },
  { label: "Efisiensi", value: "7.8", unit: "km/l", trend: "↓ 5%", trendUp: false, comparison: "vs baseline", barColor: "#EF9F27", barWidth: "65%" },
];

export const trialEmissionsData = [
  { day: "Jan", value: 0.8 },
  { day: "Feb", value: 0.9 },
  { day: "Mar", value: 1.1 },
  { day: "Apr", value: 1.4 },
  { day: "Mei", value: 1.25 },
];

export const trialTopEmitters: TopEmitter[] = [
  { name: "Hino Ranger 500", value: 0.75, pct: 60 },
  { name: "Mitsubishi Canter", value: 0.50, pct: 40 },
];

export const trialAssets: AssetRow[] = [
  { name: "Hino Ranger 500 (B 9876 PQR)", kategori: "Heavy Truck", konsumsi: 240, emisi: 0.75, status: "Aktif" },
  { name: "Mitsubishi Canter (B 9123 KLM)", kategori: "Medium Truck", konsumsi: 150, emisi: 0.50, status: "Aktif" },
  { name: "Genset Perkins (AST-GEN-01)", kategori: "Stationary", konsumsi: 36, emisi: 0.20, status: "Aktif" },
];

export const starterStatCards: StatCard[] = [
  { label: "Total Emisi", value: "3.45", unit: "ton CO₂e", trend: "↑ 19%", trendUp: true, comparison: "vs baseline", barColor: "#1D9E75", barWidth: "58%" },
  { label: "Konsumsi BBM", value: "1.245", unit: "Liter", trend: "↑ 15%", trendUp: true, comparison: "vs baseline", barColor: "#29A2A5", barWidth: "62%" },
  { label: "Asset", value: "8/10", unit: "Digunakan", trend: "", trendUp: false, comparison: "", barColor: "#29A2A5", barWidth: "80%" },
  { label: "Efisiensi", value: "8.2", unit: "km/l", trend: "↓ 3%", trendUp: false, comparison: "vs baseline", barColor: "#EF9F27", barWidth: "68%" },
];

export const starterEmissionsData = [
  { day: "Jan", value: 1.8 },
  { day: "Feb", value: 2.2 },
  { day: "Mar", value: 2.8 },
  { day: "Apr", value: 3.6 },
  { day: "Mei", value: 3.45 },
];

export const starterTopEmitters: TopEmitter[] = [
  { name: "Hino Ranger 500", value: 1.20, pct: 35 },
  { name: "Isuzu Giga FVR", value: 0.85, pct: 25 },
  { name: "Genset Perkins", value: 0.60, pct: 17 },
  { name: "Mitsubishi Canter", value: 0.45, pct: 13 },
  { name: "Toyota Hilux", value: 0.35, pct: 10 },
];

export const starterAssets: AssetRow[] = [
  { name: "Hino Ranger 500 (B 9876 PQR)", kategori: "Heavy Truck", konsumsi: 420, emisi: 1.20, efisiensi: 7.1, status: "Aktif" },
  { name: "Isuzu Giga FVR (D 4512 STU)", kategori: "Heavy Truck", konsumsi: 300, emisi: 0.85, efisiensi: 6.8, status: "Aktif" },
  { name: "Genset Perkins (AST-GEN-01)", kategori: "Stationary", konsumsi: 180, emisi: 0.60, status: "Aktif" },
];

export const starterAssetUsage = { used: 6, total: 10 };

export const proStatCards: StatCard[] = [
  { label: "Total Emisi", value: "8.62", unit: "ton CO₂e", trend: "↓ 22%", trendUp: false, comparison: "vs baseline", barColor: "#1D9E75", barWidth: "72%" },
  { label: "Konsumsi BBM", value: "3.150", unit: "Liter", trend: "↑ 18%", trendUp: true, comparison: "vs baseline", barColor: "#29A2A5", barWidth: "78%" },
  { label: "Asset", value: "6/30", unit: "Digunakan", trend: "", trendUp: false, comparison: "", barColor: "#29A2A5", barWidth: "20%" },
  { label: "Efisiensi", value: "9.3", unit: "km/l", trend: "↓ 6%", trendUp: false, comparison: "vs baseline", barColor: "#EF9F27", barWidth: "77%" },
];

export const proEmissionsData = [
  { day: "Jan", value: 3, genset: 1.5, alatBerat: 0.5 },
  { day: "Feb", value: 4, genset: 2.0, alatBerat: 0.8 },
  { day: "Mar", value: 5, genset: 2.5, alatBerat: 1.0 },
  { day: "Apr", value: 6, genset: 2.0, alatBerat: 1.2 },
  { day: "Mei", value: 5.5, genset: 1.8, alatBerat: 1.3 },
];

export const proTopEmitters: TopEmitter[] = [
  { name: "Hino Ranger 500", value: 2.90, pct: 34 },
  { name: "Mercedes Axor", value: 1.80, pct: 21 },
  { name: "Isuzu Giga FVR", value: 0.95, pct: 11 },
  { name: "Genset Perkins", value: 0.95, pct: 11 },
  { name: "Mitsubishi Canter", value: 0.76, pct: 9 },
];

export const proInsights: InsightBox[] = [
  { type: "info", title: "Analisis Database Emisi", body: "Kepatuhan IPCC Scope 1 tercapai penuh untuk seluruh armada operasional.", linkLabel: "Lihat Detail" },
  { type: "warning", title: "Anomali Terdeteksi", body: "Truk Hino Ranger (B 9876 PQR) mencatat kenaikan konsumsi 14% di rute tanjakan.", linkLabel: "Lihat Detail" },
  { type: "success", title: "Rekomendasi Efisiensi", body: "Optimasi muatan armada logistik berpotensi menghemat hingga 18% emisi.", linkLabel: "Lihat Detail" },
];

export const proAssets: AssetRow[] = [
  { name: "Hino Ranger 500 (B 9876 PQR)", kategori: "Heavy Truck", konsumsi: 920, emisi: 8.1, efisiensi: 3.5, trend: "up", status: "Aktif" },
  { name: "Mitsubishi Canter (B 9123 KLM)", kategori: "Medium Truck", konsumsi: 610, emisi: 1.80, efisiensi: 6.2, trend: "down", status: "Aktif" },
  { name: "Genset Perkins (AST-GEN-01)", kategori: "Stationary", konsumsi: 420, emisi: 1.20, trend: "flat", status: "Aktif" },
];

export const enterpriseStatCards: StatCard[] = [
  { label: "Total Emisi", value: "24.75", unit: "ton CO₂e", trend: "↑ 18%", trendUp: true, comparison: "vs baseline", barColor: "#1D9E75", barWidth: "82%" },
  { label: "Konsumsi BBM", value: "8.920", unit: "Liter", trend: "↑ 17%", trendUp: true, comparison: "vs baseline", barColor: "#29A2A5", barWidth: "78%" },
  { label: "Asset Terdaftar", value: "6", unit: "Unit Armada", trend: "", trendUp: false, comparison: "", barColor: "#29A2A5", barWidth: "100%" },
  { label: "Efisiensi Global", value: "10.2", unit: "km/l", trend: "↓ 4%", trendUp: false, comparison: "vs baseline", barColor: "#EF9F27", barWidth: "85%" },
  { label: "Lokasi Aktif", value: "3", unit: "Pool/Hub", trend: "+1", trendUp: true, comparison: "aktif", barColor: "#6366f1", barWidth: "60%" },
];

export const enterpriseEmissionsData = [
  { day: "Jan", value: 8, surabaya: 4, bali: 2, balikpapan: 1.5 },
  { day: "Feb", value: 10, surabaya: 5, bali: 2.5, balikpapan: 2 },
  { day: "Mar", value: 12, surabaya: 5.5, bali: 3, balikpapan: 2.2 },
  { day: "Apr", value: 14, surabaya: 6, bali: 3.2, balikpapan: 2.8 },
  { day: "Mei", value: 13, surabaya: 5.8, bali: 3, balikpapan: 2.5 },
];

export const enterpriseLocationBars: LocationBar[] = [
  { city: "Cikarang", value: 5.2 },
  { city: "Tanjung Priok", value: 3.1 },
  { city: "Surabaya", value: 4.2 },
];

export const enterprisePerformanceCategories: PerformanceCategory[] = [
  { name: "Heavy Truck", pct: 60, color: "#1D9E75" },
  { name: "Medium Truck", pct: 25, color: "#29A2A5" },
  { name: "Light Vehicle", pct: 10, color: "#EF9F27" },
  { name: "Genset", pct: 5, color: "#888780" },
];

export const enterpriseInsights: InsightBox[] = [
  { type: "info", title: "Insight Strategis Multi-Lokasi", body: "Depot Cikarang menyumbang konsumsi terbesar (55%). Efisiensi transmisi optimal terdeteksi.", linkLabel: "Lihat Analisis" },
  { type: "warning", title: "Peringatan Emisi", body: "Armada tronton perlu penyesuaian jadwal servis berkala.", linkLabel: "Lihat Semua" },
];

export const enterpriseAssets: AssetRow[] = [
  { name: "Hino Ranger 500 (B 9876 PQR)", location: "Pool Utama Cikarang", kategori: "Heavy Truck", konsumsi: 1250, emisi: 3.20, efisiensi: 3.5, status: "Aktif" },
  { name: "Mercedes Axor (L 7890 XYZ)", location: "Depot Surabaya", kategori: "Heavy Truck", konsumsi: 980, emisi: 2.10, efisiensi: 4.2, status: "Aktif" },
  { name: "Isuzu Giga FVR (D 4512 STU)", location: "Hub Tanjung Priok", kategori: "Heavy Truck", konsumsi: 850, emisi: 1.80, efisiensi: 4.0, status: "Aktif" },
  { name: "Toyota Hilux (B 3456 DEF)", location: "Pool Utama Cikarang", kategori: "Light Vehicle", konsumsi: 340, emisi: 0.70, efisiensi: 10.4, status: "Aktif" },
];
