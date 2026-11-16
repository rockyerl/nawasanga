"use client";

import { useState } from "react";
import { 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  ArrowUpRight, 
  BarChart3, 
  Truck, 
  Shovel, 
  Trees, 
  Factory,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CaseStudy {
  id: string;
  category: "logistics" | "mining" | "plantation" | "construction";
  categoryLabel: string;
  clientName: string;
  tagline: string;
  logoInitial: string;
  fleetProfile: string;
  heroStat: {
    value: string;
    label: string;
    trend: string;
  };
  metrics: {
    label: string;
    before: string;
    after: string;
    delta: string;
    isPositive: boolean;
  }[];
  challenge: string;
  solution: string[];
  businessImpact: string;
  complianceAchieved: string[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: "logistics",
    category: "logistics",
    categoryLabel: "Logistik & Transportasi Armada",
    clientName: "PT Nusantara Logistik Prima",
    tagline: "420 Truk Trailer & Tronton Angkutan Antar-Kota",
    logoInitial: "NLP",
    fleetProfile: "Armada Hino 500 & Mitsubishi Fuso (Trayek Jawa-Sumatera)",
    heroStat: {
      value: "Rp 840 Juta",
      label: "Penghematan Biaya Solar per Tahun",
      trend: "Pangkas 24.6% Kebocoran BBM",
    },
    metrics: [
      {
        label: "Kebocoran BBM & Nota Fiktif",
        before: "Rp 70 Juta / bulan",
        after: "Rp 0 (Tereliminasi)",
        delta: "-100% Fraud",
        isPositive: true,
      },
      {
        label: "Konsumsi Solar per 100 km",
        before: "38.2 Liter",
        after: "31.4 Liter",
        delta: "Efisiensi 17.8%",
        isPositive: true,
      },
      {
        label: "Waktu Rekonsiliasi & Audit Emisi",
        before: "4 Bulan (Manual Excel)",
        after: "3 Menit (1-Klik)",
        delta: "98x Lebih Cepat",
        isPositive: true,
      },
      {
        label: "Emisi Karbon Scope 1",
        before: "2,480 Ton CO₂e",
        after: "1,870 Ton CO₂e",
        delta: "-24.6% Emisi",
        isPositive: true,
      },
    ],
    challenge:
      "Tingginya indikasi manipulasi struk SPBU oleh oknum pengemudi di jalur lintas, pengisian bahan bakar fiktif, serta proses pembuatan laporan keberlanjutan tahunan (POJK 51) yang memakan waktu 4 bulan kerja tim akuntansi dan auditor.",
    solution: [
      "Implementasi Driver Mobile QR Fuel Log dengan validasi foto struk kasir dan odometer wajib.",
      "Algoritma Anomaly Detection yang langsung mendeteksi pengisian melebihi kapasitas tangki atau rute anomali.",
      "Kalkulasi emisi otomatis Tier-2 IPCC 2006 dan generate berkas kesiapan audit emisi siap serah ke Auditor KAN.",
    ],
    businessImpact:
      "Penghematan kas operasional Rp 840 Juta/tahun, kepatuhan audit ESG 100% tanpa catatan defisit, serta perolehan fasilitas pembiayaan hijau (Green Financing) perbankan dengan bunga istimewa.",
    complianceAchieved: [
      "POJK 51/POJK.03/2017 Kategori Keuangan Berkelanjutan",
      "ISO 14064-1:2018 Verifikasi Emisi Gas Rumah Kaca",
      "Mandatori Biodiesel B35/B40 Kementerian ESDM",
    ],
    quote: {
      text: "Nawasanga mengubah proses audit bahan bakar kami dari mimpi buruk manipulasi bon kasir menjadi transparansi mutlak. Dalam 60 hari pertama, kebocoran solar terhenti total dan kami menghemat ratusan juta rupiah.",
      author: "Hendra Wijaya, S.T., M.M.",
      role: "VP of Fleet Operations & ESG Compliance, PT Nusantara Logistik Prima",
    },
  },
  {
    id: "mining",
    category: "mining",
    categoryLabel: "Pertambangan & Alat Berat",
    clientName: "PT Borneo Prima Mining & Resources",
    tagline: "280 Unit Excavator PC2000, Bulldozer & Haul Truck CAT 777",
    logoInitial: "BPM",
    fleetProfile: "Alat Berat Tambang Batubara & Nikel Site Kalimantan Timur",
    heroStat: {
      value: "Rp 2.4 Miliar",
      label: "Penghematan HSD Solar Industri per Kuartal",
      trend: "Efisiensi 14.2% Konsumsi Solar",
    },
    metrics: [
      {
        label: "Konsumsi HSD Bulanan",
        before: "1,250,000 Liter",
        after: "1,072,500 Liter",
        delta: "Hemat 177,500 L/bln",
        isPositive: true,
      },
      {
        label: "Monitoring per Hour Meter (SMU)",
        before: "Tidak Terintegrasi",
        after: "Real-time Telemetri",
        delta: "100% Visibilitas",
        isPositive: true,
      },
      {
        label: "Pelaporan SIMPEL KLHK",
        before: "3 Minggu per Periode",
        after: "Otomatis Siap Kirim",
        delta: "Zero Keterlambatan",
        isPositive: true,
      },
      {
        label: "Audit Kepatuhan Lingkungan",
        before: "Berpotensi Sanksi",
        after: "Predikat Emas PROPER",
        delta: "Zero Finding",
        isPositive: true,
      },
    ],
    challenge:
      "Konsumsi bahan bakar solar industri masif mencapai lebih dari 1.2 juta liter setiap bulan pada lokasi tambang terpencil, tanpa visibilitas efisiensi per jam operasional (SMU), serta risiko denda keterlambatan pelaporan SIMPEL KLHK.",
    solution: [
      "Konsolidasi log pengisian dari bunker bahan bakar site dengan atribusi per nomor seri alat berat.",
      "Monitoring rasio liter per jam operasional mesin (SMU) untuk mendeteksi unit alat berat yang aus atau bocor.",
      "Format pelaporan langsung sinkron dengan standar SMART KLHK dan emisi Scope 1 bergerak maupun stasioner.",
    ],
    businessImpact:
      "Pengurangan belanja BBM solar sebesar Rp 2.4 Miliar per kuartal, zero sanksi denda lingkungan dari KLHK, serta peningkatan indeks PROPER perusahaan menuju peringkat emas.",
    complianceAchieved: [
      "Pelaporan SIMPEL KLHK (Sistem Informasi Pelaporan Elektronik Lingkungan)",
      "Perpres 98/2021 tentang Nilai Ekonomi Karbon (NEK)",
      "GWP AR6 IPCC Standard untuk Alat Berat Non-Road Mobile Machinery",
    ],
    quote: {
      text: "Mengawasi 280 alat berat di pedalaman tanpa celah kebocoran solar tadinya terdengar mustahil. Dengan Nawasanga, setiap liter yang keluar dari bunker tercatat akurat dan langsung terkonversi menjadi ton CO₂e siap audit.",
      author: "Ir. Bambang Trihatmojo",
      role: "Direktur Operasional Tambang, PT Borneo Prima Mining & Resources",
    },
  },
  {
    id: "plantation",
    category: "plantation",
    categoryLabel: "Perkebunan & Industri Sawit",
    clientName: "PT Agro Sawit Nusantara Group",
    tagline: "15 Pabrik Kelapa Sawit (PKS) & 650 Armada Angkut TBS",
    logoInitial: "ASN",
    fleetProfile: "Truk Angkut TBS, Traktor Perkebunan & Genset Pabrik (Sumatera & Riau)",
    heroStat: {
      value: "+4.8% Premi",
      label: "Kenaikan Nilai Ekspor CPO Pasar Eropa",
      trend: "Lolos Kepatuhan Audit EUDR 100%",
    },
    metrics: [
      {
        label: "Verifikasi Jejak Karbon Scope 1",
        before: "Estimasi Manual",
        after: "Sertifikasi Digital QR",
        delta: "Audit-Ready ISO",
        isPositive: true,
      },
      {
        label: "Kalkulasi Bio-blending B35/B40",
        before: "Salah Hitung Faktor",
        after: "Otomatis Formula IPCC",
        delta: "Presisi 99.9%",
        isPositive: true,
      },
      {
        label: "Audit Defisit EUDR & RSPO",
        before: "6 Temuan Minor",
        after: "Zero Defisit (Bersih)",
        delta: "100% Lolos Audit",
        isPositive: true,
      },
      {
        label: "Efisiensi Rute Kebun ke PKS",
        before: "Rp 14,200 / Ton TBS",
        after: "Rp 11,800 / Ton TBS",
        delta: "Hemat 16.9%",
        isPositive: true,
      },
    ],
    challenge:
      "Pemberlakuan regulasi ketat European Union Deforestation Regulation (EUDR) dan standar RSPO mewajibkan transparansi penuh jejak karbon logistik TBS dari kebun hingga dermaga ekspor CPO. Penghitungan manual sering gagal lolos audit internasional.",
    solution: [
      "Struktur multi-tenant per estate perkebunan dengan isolasi data dan konsolidasi level holding.",
      "Algoritma penghitungan emisi biogenik vs fosil berdasarkan mandatori Biodiesel B35 dan B40.",
      "Penerbitan Certificate of Carbon Accounting ISO 14064-1 yang dilengkapi hash kriptografis untuk auditor asing.",
    ],
    businessImpact:
      "Perusahaan berhasil mempertahankan akses pasar ekspor Uni Eropa tanpa hambatan bea masuk karbon, serta menikmati premi harga jual CPO sebesar +4.8% per metrik ton berkat sertifikasi karbon yang transparan.",
    complianceAchieved: [
      "EUDR (EU Deforestation-free Regulation) Carbon Footprint Rules",
      "RSPO & ISPO Sustainable Transport Verification",
      "ISO 14064-1:2018 Direct Land Transport GHG Inventory",
    ],
    quote: {
      text: "Auditor eksternal dari Eropa sangat terkesan saat kami menunjukkan dashboard Nawasanga. Data jejak karbon per ton TBS tersaji detail hingga ke level nomor polisi truk dan foto struk pengisian solar.",
      author: "Raden Sukoco, S.P., M.Sc.",
      role: "Head of Sustainability & Certification, PT Agro Sawit Nusantara Group",
    },
  },
  {
    id: "construction",
    category: "construction",
    categoryLabel: "Konstruksi & Infrastruktur",
    clientName: "PT Cikarang Karya Beton & Proyek",
    tagline: "90 Unit Truk Molen (Mixer) & 35 Genset Proyek Stasioner",
    logoInitial: "CKB",
    fleetProfile: "Armada Truk Molen Hino & Genset Kapasitas 250 - 500 kVA",
    heroStat: {
      value: "Rp 420 Juta",
      label: "Penghematan BBM Genset & Armada per Tahun",
      trend: "Eliminasi Idling Mesin 32%",
    },
    metrics: [
      {
        label: "Solar Genset Proyek Terbuang",
        before: "24 Liter / Jam",
        after: "16.5 Liter / Jam",
        delta: "Hemat 31.2%",
        isPositive: true,
      },
      {
        label: "Akurasi Biaya per Proyek",
        before: "62% (Banyak Selisih)",
        after: "99.4% (Tepat Sasaran)",
        delta: "Presisi Tinggi",
        isPositive: true,
      },
      {
        label: "Klaim BBM Ganda / SPBU Luar",
        before: "18 Kasus / bulan",
        after: "0 Kasus Terblokir",
        delta: "-100% Kebocoran",
        isPositive: true,
      },
      {
        label: "Laporan Hijau Tender BUMN",
        before: "Dokumen Manual",
        after: "Dossier Emisi Siap Audit",
        delta: "Menang Tender 5x",
        isPositive: true,
      },
    ],
    challenge:
      "Kesulitan mengontrol konsumsi solar genset pada proyek konstruksi stasioner yang sering dibiarkan menyala saat tidak digunakan (excessive idling), serta ketidakakuratan alokasi biaya bahan bakar per proyek.",
    solution: [
      "Kombinasi pemantauan konsumsi armada bergerak (truk molen) dan genset stasioner dalam satu portal tunggal.",
      "Benchmark rasio konsumsi solar per jam kerja generator untuk mendeteksi pencurian atau kebocoran tangki.",
      "Pemisahan pembukuan biaya bahan bakar per kode proyek untuk transparansi profitabilitas proyek.",
    ],
    businessImpact:
      "Penghematan biaya solar Rp 420 Juta/tahun, memenangkan 5 tender konstruksi strategis pemerintah karena memenuhi kualifikasi Green Construction dengan bukti audit emisi karbon lengkap.",
    complianceAchieved: [
      "Permen PUPR Pedoman Standar Bangunan Gedung Hijau (BGH)",
      "ISO 14064-1 Kategori Stasioner & Mobile Equipment",
      "SNI Kualifikasi Kontraktor Ramah Lingkungan",
    ],
    quote: {
      text: "Dalam industri konstruksi dengan margin tipis, menghentikan kebocoran solar genset proyek adalah kunci laba. Nawasanga memberi kami kepastian angka hingga ke rupiah terakhir.",
      author: "Budi Santoso, S.T.",
      role: "Project Director & COO, PT Cikarang Karya Beton & Proyek",
    },
  },
];

export default function CaseStudies() {
  const [activeTab, setActiveTab] = useState<string>("logistics");
  const activeStudy = caseStudies.find((c) => c.id === activeTab) || caseStudies[0];

  return (
    <section id="case-studies" className="py-28 relative bg-[#F7F5EF] border-b border-[#1D6B5A]/15 overflow-hidden">
      {/* Decorative ambient background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 15% 20%, rgba(29, 107, 90, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(184, 150, 46, 0.06) 0%, transparent 45%)"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D6B5A]/10 border border-[#1D6B5A]/25 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1D6B5A] animate-pulse" />
            <span className="font-ui text-xs font-bold text-[#1D6B5A] tracking-widest uppercase">
              Studi Kasus & Nilai Bisnis Terbukti
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-[#1A1A18] tracking-tight leading-[1.12] mb-4">
            Bukan Sekadar Klaim Teori.
            <br />
            <span className="text-gradient-hero">Hasil Nyata di 500+ Armada Korporat.</span>
          </h2>
          <p className="font-ui text-[#7A7A72] text-base leading-relaxed">
            Lihat bagaimana perusahaan logistik nasional, operator tambang batu bara, dan grup kelapa sawit terbesar di Indonesia memangkas kebocoran BBM dan menuntaskan audit sertifikasi emisi ISO 14064 dalam hitungan menit.
          </p>
        </div>

        {/* Industry Sector Tab Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#EDEAE0] border border-[#1D6B5A]/15 mb-10">
          {caseStudies.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = 
              item.id === "logistics" ? Truck :
              item.id === "mining" ? Shovel :
              item.id === "plantation" ? Trees : Factory;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1D6B5A] shadow-md border border-[#1D6B5A]/20 font-semibold"
                    : "text-[#7A7A72] hover:text-[#1A1A18] hover:bg-white/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-[#1D6B5A] text-white" : "bg-[#1D6B5A]/10 text-[#1D6B5A]"}`}>
                  <Icon size={16} />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold truncate leading-tight">{item.clientName.split(" ")[1]} {item.clientName.split(" ")[2] || ""}</div>
                  <div className="text-[11px] text-[#7A7A72] truncate">{item.categoryLabel.split(" ")[0]}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Case Study Detail Showcase */}
        <div className="rounded-3xl bg-white border border-[#1D6B5A]/20 shadow-[0_25px_60px_-15px_rgba(29,107,90,0.08)] overflow-hidden">
          {/* Top Banner / Headline */}
          <div className="p-8 md:p-10 border-b border-[#EDEAE0] bg-gradient-to-r from-white via-[#F7F5EF]/60 to-white">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="outline" className="border-[#1D6B5A]/30 bg-[#1D6B5A]/5 text-[#1D6B5A] font-semibold text-xs py-1 px-3">
                    {activeStudy.categoryLabel}
                  </Badge>
                  <span className="text-xs text-[#7A7A72] font-mono">
                    Profil: {activeStudy.fleetProfile}
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-[#1A1A18] font-bold tracking-tight">
                  {activeStudy.clientName}
                </h3>
                <p className="text-sm font-medium text-[#7A7A72]">
                  {activeStudy.tagline}
                </p>
              </div>

              {/* Big Highlight ROI Metric Card */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#1D6B5A] to-[#104238] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
                <span className="text-xs uppercase tracking-wider text-white/75 font-semibold block mb-1">
                  Hasil ROI Terverifikasi
                </span>
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#D4AF5A] mb-1">
                  {activeStudy.heroStat.value}
                </div>
                <div className="text-xs text-white/90 font-medium mb-3">
                  {activeStudy.heroStat.label}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-emerald-200">
                  <TrendingUp size={12} /> {activeStudy.heroStat.trend}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Quantitative Proof Metrics (Before vs After) */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EDEAE0] bg-[#FAF8F5] border-b border-[#EDEAE0]">
            {activeStudy.metrics.map((m, idx) => (
              <div key={idx} className="p-6 space-y-2">
                <span className="text-xs font-semibold text-[#7A7A72] block leading-snug">
                  {m.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-red-500 line-through decoration-red-400">
                    {m.before}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {m.after}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#1D6B5A]">
                  <CheckCircle2 size={12} /> {m.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative Deep Dive: Tantangan, Solusi, & Regulasi */}
          <div className="p-8 md:p-10 grid lg:grid-cols-12 gap-10">
            {/* Left: Challenge & Solutions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C14B2A] flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} /> Tantangan Operasional Sebelum Nawasanga
                </h4>
                <p className="text-sm text-[#1A1A18] leading-relaxed bg-red-50/50 p-4 rounded-xl border border-red-100">
                  {activeStudy.challenge}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D6B5A] flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} /> Solusi yang Diterapkan Nawasanga
                </h4>
                <div className="space-y-2.5">
                  {activeStudy.solution.map((sol, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#EDEAE0]">
                      <div className="w-5 h-5 rounded-full bg-[#1D6B5A]/10 text-[#1D6B5A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        {sIdx + 1}
                      </div>
                      <span className="text-xs text-gray-800 leading-relaxed font-medium">
                        {sol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D6B5A] flex items-center gap-2 mb-2">
                  <TrendingUp size={14} /> Dampak Finansial & Bisnis Langsung
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 font-medium">
                  {activeStudy.businessImpact}
                </p>
              </div>
            </div>

            {/* Right: Verified Regulatory Compliance & Executive Endorsement */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#F7F5EF] border border-[#1D6B5A]/15 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1D6B5A] block">
                  Kepatuhan Standar & Audit Lolos
                </span>
                <div className="space-y-2">
                  {activeStudy.complianceAchieved.map((comp, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2.5 text-xs text-gray-800">
                      <div className="p-1 rounded-md bg-[#1D6B5A] text-white">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="font-semibold">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Testimonial Quote */}
              <div className="p-6 rounded-2xl bg-white border border-[#1D6B5A]/20 shadow-sm relative">
                <div className="text-3xl font-serif text-[#B8962E]/30 absolute top-3 left-4 select-none">“</div>
                <p className="text-xs text-gray-700 italic leading-relaxed pt-3 pb-4">
                  {activeStudy.quote.text}
                </p>
                <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1D6B5A] text-white flex items-center justify-center text-xs font-bold font-mono">
                    {activeStudy.logoInitial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{activeStudy.quote.author}</div>
                    <div className="text-[11px] text-[#7A7A72]">{activeStudy.quote.role}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href="/login"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1D6B5A] hover:bg-[#175749] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  Lihat Demo Interaktif Kasus Ini <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
