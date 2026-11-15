import type { PlanType } from "@/types/features/report-tren.type";

export interface PlanOption {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  highlight?: boolean;
}

export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "trial",
    name: "Trial",
    price: "Gratis",
    period: "14 hari",
    desc: "Untuk mencoba fitur dasar Fuel Carbon.",
    features: [
      "Maks. 3 aset kendaraan",
      "Perhitungan emisi dasar",
      "Laporan bulanan sederhana",
      "Dukungan komunitas",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "Rp 1.500.000",
    period: "per bulan",
    desc: "Cocok untuk armada kecil berkembang.",
    features: [
      "Maks. 10 aset kendaraan",
      "Audit trail 90 hari",
      "Ekspor PDF & Excel",
      "Dukungan email 24/7",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp 4.500.000",
    period: "per bulan",
    desc: "Untuk bisnis logistik & transportasi menengah.",
    features: [
      "Maks. 30 aset kendaraan",
      "Integrasi telematika OBD-II",
      "Rekomendasi efisiensi rute AI",
      "Multi-user RBAC",
      "Dukungan prioritas",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Kustom",
    period: "tahunan",
    desc: "Skala penuh dengan kustomisasi mendalam.",
    features: [
      "Aset kendaraan tak terbatas",
      "Laporan sertifikasi ESG audit",
      "Dedicated account manager",
      "SLA 99.9% uptime",
    ],
  },
];
