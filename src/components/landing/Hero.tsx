"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Fuel, 
  CloudRain, 
  AlertCircle, 
  FileCheck2, 
  Terminal,
  Activity,
  Layers,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"telemetry" | "carbon" | "certificate">("telemetry");

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#F7F5EF] pt-24 pb-16">
      {/* High-end ambient lighting & mesh glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% -10%, rgba(29, 107, 90, 0.12) 0%, transparent 65%),
            radial-gradient(circle at 10% 40%, rgba(184, 150, 46, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 70%, rgba(29, 107, 90, 0.06) 0%, transparent 45%)
          `
        }}
      />

      {/* Grid background texture */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Top Enterprise Compliance Strip */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#1D6B5A]/20 shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D6B5A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D6B5A]"></span>
            </span>
            <span className="font-ui text-xs font-semibold text-[#1D6B5A] tracking-wider uppercase">
              Standar Audit ISO 14064-1:2018 · IPCC AR6 · POJK 51 Terverifikasi
            </span>
          </div>
        </div>

        {/* Main Executive Headline */}
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-10">
          <h1 
            className="font-display font-bold tracking-tight text-[#1A1A18] leading-[1.08]"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.4rem)" }}
          >
            Pangkas 24.6% Kebocoran BBM Armada &{" "}
            <span className="text-gradient-hero">Otomasi Audit Emisi ESG ISO 14064</span>
          </h1>

          <p className="font-ui text-base md:text-xl text-[#7A7A72] leading-relaxed max-w-3xl mx-auto">
            Platform Intelligence Konsumsi Bahan Bakar & Inventarisasi Emisi Gas Rumah Kaca (Scope 1) 
            untuk <span className="font-semibold text-[#1A1A18]">500+ armada logistik</span>, alat berat pertambangan, 
            dan genset industri. Terbitkan laporan kepatuhan dalam <span className="font-semibold text-[#1D6B5A]">3 menit</span>, 
            bukan 4 bulan.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1D6B5A] hover:bg-[#175749] text-white font-ui font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#1D6B5A]/20 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              Mulai Uji Coba Enterprise (14 Hari)
              <ArrowRight size={16} />
            </a>

            <a
              href="#case-studies"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-[#1D6B5A]/25 hover:border-[#1D6B5A]/60 text-[#1A1A18] hover:text-[#1D6B5A] font-ui font-semibold text-sm transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              Lihat 4 Studi Kasus Nyata ↓
            </a>

            <a
              href="/login"
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-[#7A7A72] hover:text-[#1A1A18] font-ui text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Login Portal Demo →
            </a>
          </div>
        </div>

        {/* Enterprise Executive Cockpit Mockup / Interactive Telemetry Simulator */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="rounded-3xl bg-neutral-900 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.35)] overflow-hidden text-neutral-200">
            {/* Cockpit Window Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-white/15 mx-1" />
                <span className="font-mono text-xs text-neutral-400 flex items-center gap-2">
                  <Terminal size={13} className="text-[#2A9478]" />
                  nawasanga-engine://telemetry.v2/audit-stream
                </span>
              </div>

              {/* Cockpit Mode Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-neutral-800/80 border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeTab === "telemetry" 
                      ? "bg-[#1D6B5A] text-white shadow-sm" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Anti-Fraud Solar
                </button>
                <button
                  onClick={() => setActiveTab("carbon")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeTab === "carbon" 
                      ? "bg-[#1D6B5A] text-white shadow-sm" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Inventarisasi Scope 1
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("certificate")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeTab === "certificate" 
                      ? "bg-[#1D6B5A] text-white shadow-sm" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Kesiapan Audit Scope 1
                </button>
              </div>
            </div>

            {/* Cockpit Content Panels */}
            <div className="p-6 md:p-8 bg-neutral-900/95">
              {activeTab === "telemetry" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Activity size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          Live Feed Transaksi Armada: Hino 500 FG 235 JJ
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-semibold">
                            REALTIME ENCRYPTED
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          ID: TX-202611-9482 • Pengemudi: Agus Santoso • PT Nusantara Logistik Prima
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono text-xs">
                      Status: PASSED / ZERO LEAKAGE
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-800/60 border border-white/5 space-y-1">
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Fuel size={13} className="text-[#2A9478]" /> Pengisian Solar
                      </span>
                      <div className="text-xl font-bold text-white">140.0 Liter</div>
                      <span className="text-[10px] text-emerald-400">Dexlite (Sesuai Kapasitas Tangki)</span>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-800/60 border border-white/5 space-y-1">
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <TrendingUp size={13} className="text-[#D4AF5A]" /> Total Biaya
                      </span>
                      <div className="text-xl font-bold text-white">Rp 2.037.000</div>
                      <span className="text-[10px] text-neutral-400">Valid via Struk AI OCR</span>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-800/60 border border-white/5 space-y-1">
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <CloudRain size={13} className="text-sky-400" /> Emisi Dihasilkan
                      </span>
                      <div className="text-xl font-bold text-sky-300">371.0 kg CO₂e</div>
                      <span className="text-[10px] text-neutral-400">Faktor IPCC AR6 Blended</span>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-800/60 border border-white/5 space-y-1">
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-400" /> Delta Odometer
                      </span>
                      <div className="text-xl font-bold text-emerald-400">+280 km</div>
                      <span className="text-[10px] text-neutral-400">Rasio 2.0 km/L (Wajar)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 font-mono text-xs space-y-1.5">
                    <div className="text-neutral-400 flex items-center justify-between">
                      <span className="text-[#2A9478]">▶ Sentinel Anti-Fraud Verification Log:</span>
                      <span className="text-[11px]">Lat: -6.4025, Lon: 107.1294 (SPBU KM 57 Tol Japek)</span>
                    </div>
                    <div className="text-neutral-300">
                      [OK] Geofence radius SPBU: Valid (Jarak 14 meter dari dispenser)
                    </div>
                    <div className="text-neutral-300">
                      [OK] Nilai konsumsi: 140L &le; Kapasitas tangki maksimal 200L (Tidak over-tank)
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      [PASSED] Transaksi disetujui otomatis. Potensi klaim ganda dicegah.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "carbon" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <CloudRain size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          IPCC Tier-2 Mobile Combustion Engine (Scope 1)
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-mono font-semibold">
                            FORMULA AR6
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          Penghitungan Gas Rumah Kaca: CO₂ + CH₄ + N₂O dengan bio-fraction mandatori Biodiesel B35
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 font-mono text-xs">
                      SIGN-SMART KLHK Compatible
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-800/60 border border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-neutral-300">Total Emisi Fosil (Gross)</span>
                      <div className="text-2xl font-bold text-white">412.50 <span className="text-sm font-normal text-neutral-400">Ton CO₂e</span></div>
                      <p className="text-[11px] text-neutral-400">Kalkulasi 155,000 liter solar murni tanpa blending.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-800/60 border border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-emerald-400">Pengurangan Mandatori B35</span>
                      <div className="text-2xl font-bold text-emerald-400">-128.40 <span className="text-sm font-normal">Ton CO₂e</span></div>
                      <p className="text-[11px] text-neutral-400">Kredit biogenik FAME 35% sesuai regulasi ESDM 2024.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1D6B5A]/20 border border-[#2A9478]/30 space-y-2">
                      <span className="text-xs font-semibold text-white">Net Scope 1 GHG Terverifikasi</span>
                      <div className="text-2xl font-bold text-[#D4AF5A]">284.10 <span className="text-sm font-normal text-white/80">Ton CO₂e</span></div>
                      <p className="text-[11px] text-neutral-300">Siap diekspor ke format Laporan Keberlanjutan OJK.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between">
                    <div className="text-xs text-neutral-300">
                      <span className="font-semibold text-white">Metodologi: </span>
                      2006 IPCC Guidelines for National Greenhouse Gas Inventories, Vol. 2 (Energy), Ch. 3 (Mobile Combustion).
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">100% AUDIT READY</span>
                  </div>
                </div>
              )}

              {activeTab === "certificate" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#D4AF5A]/10 text-[#D4AF5A] border border-[#D4AF5A]/20">
                        <FileCheck2 size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          Dossier Kesiapan Audit Emisi (ISO 14064-1 &amp; POJK 51)
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF5A]/15 text-[#D4AF5A] text-[10px] font-mono font-semibold">
                            CRYPTOGRAPHIC HASH
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          Kertas kerja &amp; bukti transaksi lengkap siap diserahkan ke Lembaga Verifikasi Resmi (Sucofindo, SGS, TÜV, PwC)
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-[#D4AF5A]/30 text-[#D4AF5A] bg-[#D4AF5A]/10 font-mono text-xs">
                      Dossier Ref: NW-2026-AUDIT-0081
                    </Badge>
                  </div>

                  {/* Audit Dossier preview miniature */}
                  <div className="p-6 rounded-2xl bg-white text-neutral-900 border-2 border-[#D4AF5A] space-y-4 shadow-xl">
                    <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                      <div>
                        <div className="text-xs tracking-widest text-[#1D6B5A] uppercase font-bold">
                          NAWASANGA CARBON ASSURANCE SYSTEM
                        </div>
                        <div className="text-lg font-serif font-bold text-neutral-900">
                          Audit Readiness Dossier — Scope 1 Direct Emissions
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Standar Format Verifikasi Sesuai ISO 14064-1:2018 &amp; POJK No. 51/2017
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono text-xs">
                        QR OK
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Entitas Terlapor:</span>
                        <span className="font-bold">PT Nusantara Logistik Prima</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Total Emisi Terverifikasi:</span>
                        <span className="font-bold text-[#1D6B5A]">1,870.24 Ton CO₂e</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Periode Pelaporan:</span>
                        <span className="font-bold">Tahun Buku 2025/2026</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-600 bg-neutral-100 p-2.5 rounded-lg font-mono">
                      Signature SHA-256: 4e9f78b12a8093d6c14e4b5a2f8b0e7d9a1c3e5f7a9b0c2d4e6f8a0b2c4e6f8a
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Quantitative Social Proof Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { value: "520+", label: "Armada Korporat Aktif", sub: "Logistik, Tambang, Sawit" },
            { value: "Rp 4.8 Miliar", label: "Kebocoran BBM Dieliminasi", sub: "Penghematan kas terbukti" },
            { value: "32,400 Ton", label: "CO₂e Terverifikasi Audit", sub: "Standar IPCC 2006 GWP AR6" },
            { value: "100%", label: "Lolos POJK 51 & SIMPEL", sub: "Zero non-conformance" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-white border border-[#1D6B5A]/15 shadow-xs text-center space-y-1 hover:border-[#1D6B5A]/35 transition-all"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-[#1D6B5A] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[#1A1A18] leading-tight">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#7A7A72]">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
