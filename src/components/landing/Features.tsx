"use client";

import { 
  ShieldAlert, 
  Cpu, 
  FileCheck, 
  Smartphone, 
  Network, 
  Cable, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Lock,
  Zap,
  BarChart4
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const coreCapabilities = [
  {
    icon: ShieldAlert,
    badge: "Keamanan Finansial",
    title: "Sentinel Anti-Fraud & Deteksi Kebocoran Solar",
    description:
      "Eliminasi manipulasi nota BBM, 'solar kencing', dan klaim fiktif pengemudi dengan verifikasi tiga lapis: AI OCR struk kasir, radius geofencing SPBU, dan batas fisik kapasitas tangki.",
    highlights: [
      "Auto-flagging transaksi > kapasitas fisik tangki",
      "Pencocokan lokasi GPS supir vs koordinat SPBU",
      "Pencegahan foto struk kasir duplikat dengan image hashing",
    ],
    metric: "-24.6% Fraud BBM",
    metricLabel: "Rata-rata eliminasi kebocoran solar armada",
  },
  {
    icon: Cpu,
    badge: "Kalkulasi Presisi",
    title: "Mesin Inventarisasi Emisi Scope 1 GHG (IPCC Tier-2)",
    description:
      "Kalkulasi emisi Gas Rumah Kaca bergerak (truk/alat berat) dan stasioner (genset/boiler) sesuai panduan 2006 IPCC Guidelines dan Perpres No. 98/2021 tentang Nilai Ekonomi Karbon.",
    highlights: [
      "Penghitungan senyawa CO₂, CH₄, dan N₂O berbasis GWP AR6",
      "Koreksi fraksi biogenik mandatori Biodiesel B35 & B40 ESDM",
      "Atribusi emisi per kilometer (km) atau per jam kerja mesin (SMU)",
    ],
    metric: "99.9% Presisi",
    metricLabel: "Akurasi sesuai protokol pelaporan OJK & KLHK",
  },
  {
    icon: FileCheck,
    badge: "Kepatuhan Regulasi",
    title: "Generator Sertifikat & Laporan Kesiapan Audit 1-Klik",
    description:
      "Hentikan lembur 4 bulan tim akuntansi untuk menyusun laporan keberlanjutan. Terbitkan PDF laporan kepatuhan ISO 14064-1 dan POJK 51/2017 dalam 3 menit.",
    highlights: [
      "Dokumen PDF siap tanda tangan digital untuk auditor eksternal",
      "Dilengkapi Cryptographic Hash & QR Code verification scan",
      "Export multi-kolom CSV/Excel dengan UTF-8 BOM untuk ERP korporat",
    ],
    metric: "3 Menit",
    metricLabel: "Waktu terbit dokumen kesiapan audit ISO",
  },
  {
    icon: Smartphone,
    badge: "Kemudahan Lapangan",
    title: "Driver Mobile PWA (Tanpa Instalasi Aplikasi)",
    description:
      "Pengemudi truk dan operator alat berat cukup membuka link browser smartphone tanpa unduh aplikasi. Selesai input transaksi BBM dan foto struk dalam waktu 20 detik.",
    highlights: [
      "Antarmuka ramah pengemudi dengan tombol kontras tinggi",
      "Kamera langsung untuk jepret struk kasir dan odometer fisik",
      "Offline caching: data tersimpan lokal saat melintasi blank spot",
    ],
    metric: "20 Detik",
    metricLabel: "Rata-rata waktu pengisian log oleh sopir",
  },
  {
    icon: Network,
    badge: "Arsitektur Enterprise",
    title: "Isolasi Multi-Tenant & Hierarki Cabang / Anak Usaha",
    description:
      "Kelola holding konglomerasi dengan puluhan anak perusahaan, divisi, atau kontraktor dalam satu sistem dengan isolasi database yang terenkripsi dan aman.",
    highlights: [
      "5 level Role-Based Access Control (RBAC) dengan audit log ketat",
      "Row-level security memastikan data anak perusahaan tidak bocor",
      "Konsolidasi laporan level grup holding secara otomatis",
    ],
    metric: "Bank-Grade",
    metricLabel: "Enkripsi data & perlindungan kepatuhan ISO 27001",
  },
  {
    icon: Cable,
    badge: "Integrasi Sistem",
    title: "Integrasi Telematika GPS & ERP Webhook (SAP / Oracle)",
    description:
      "Hubungkan Nawasanga secara mulus dengan vendor GPS tracker armada Anda (Geotab, Cartrack, EasyGo) serta sistem enterprise resource planning keuangan kantor pusat.",
    highlights: [
      "Webhook real-time untuk stream telemetri odometer & bahan bakar",
      "RESTful API enterprise dengan dokumentasi OpenAPI / Swagger",
      "Sinkronisasi otomatis master data armada, supir, dan SPBU",
    ],
    metric: "Real-time",
    metricLabel: "Sinkronisasi data telemetri armada secara otomatis",
  },
];

export default function Features() {
  return (
    <section id="fitur" className="py-28 relative bg-white border-b border-[#1D6B5A]/15">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D6B5A]/10 border border-[#1D6B5A]/25 mb-4">
            <Zap size={14} className="text-[#1D6B5A]" />
            <span className="font-ui text-xs font-bold text-[#1D6B5A] tracking-widest uppercase">
              Kapabilitas Platform Enterprise
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-[#1A1A18] tracking-tight leading-[1.12] mb-4">
            Nawasanga Bisa Ngapain Saja?
            <br />
            <span className="text-gradient-hero">Semua Kebutuhan Monitoring BBM & ESG Anda.</span>
          </h2>
          <p className="font-ui text-[#7A7A72] text-base leading-relaxed">
            Dirancang dari nol untuk memenuhi kebutuhan operasional lapangan para manajer logistik, 
            sekaligus memuaskan auditor sertifikasi karbon internasional dan dewan direksi.
          </p>
        </div>

        {/* 6 Grid Core Capabilities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {coreCapabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="rounded-3xl border border-[#1D6B5A]/15 bg-[#FDFCF9] p-8 flex flex-col justify-between hover:border-[#1D6B5A]/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="p-3 rounded-2xl bg-[#1D6B5A]/10 text-[#1D6B5A] group-hover:bg-[#1D6B5A] group-hover:text-white transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-semibold text-[#1D6B5A] border-[#1D6B5A]/25 bg-white">
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#1A1A18] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-ui text-xs text-[#7A7A72] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {item.highlights.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-gray-800">
                        <CheckCircle2 size={14} className="text-[#1D6B5A] shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EDEAE0] flex items-baseline justify-between">
                  <div>
                    <div className="text-xl font-extrabold text-[#1D6B5A] tracking-tight">
                      {item.metric}
                    </div>
                    <div className="text-[11px] text-[#7A7A72]">
                      {item.metricLabel}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-[#1D6B5A]/5 text-[#1D6B5A] group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industrial Segment Support Banner */}
        <div className="rounded-3xl bg-[#1A1A18] text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D6B5A]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <Badge variant="outline" className="border-[#D4AF5A]/40 text-[#D4AF5A] bg-[#D4AF5A]/10 text-xs">
                Cakupan Industri Multi-Sektor
              </Badge>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                Siap Diterapkan pada Seluruh Jenis Armada & Aset Energi
              </h3>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                Dari truk tronton logistik, haul truck tambang, genset proyek, hingga kapal tugboat dan armada kendaraan listrik (EV) komersial.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <a
                href="#pricing"
                className="py-3 px-6 rounded-xl bg-[#D4AF5A] hover:bg-[#C9A040] text-[#1A1A18] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Konsultasikan Kebutuhan Armada <ArrowRight size={14} />
              </a>
              <a
                href="/login"
                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                Akses Sandbox Uji Coba Gratis
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
