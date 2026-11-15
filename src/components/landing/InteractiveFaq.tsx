"use client";

import { Accordion, Badge } from "@mantine/core";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    value: "methodology",
    question: "Bagaimana metodologi kalkulasi emisi karbon di Nawasanga?",
    answer:
      "Nawasanga menerapkan metodologi kalkulasi IPCC 2006 Guidelines for National Greenhouse Gas Inventories (Tier 1 & Tier 2) yang diselaraskan dengan pedoman teknis Kementerian Lingkungan Hidup dan Kehutanan (KLHK) serta ESDM. Emisi dihitung otomatis dari volume konsumsi (Liters) dikalikan faktor emisi standar tiap varian BBM (Solar B35, Dexlite, Pertamax) dan memperhitungkan konversi GWP AR6.",
  },
  {
    value: "compliance",
    question: "Apakah laporan Nawasanga kompatibel dengan regulasi Perpres 98/2021 dan POJK 51/2017?",
    answer:
      "Ya, 100% kompatibel. Format laporan ringkasan emisi, audit trail per pengisian, dan grafik tren yang dihasilkan siap digunakan untuk laporan keberlanjutan (Sustainability Report) emisi Scope 1, serta dapat langsung disinkronkan ke pelaporan SRN-PPI (Sistem Registri Nasional Pengendalian Perubahan Iklim).",
  },
  {
    value: "offline",
    question: "Bagaimana jika armada beroperasi di area minim sinyal (remote site / perkebunan)?",
    answer:
      "Nawasanga dirancang dengan dukungan Progressive Web App (PWA) yang dapat menyimpan transaksi input bahan bakar secara lokal saat offline, lalu otomatis menyinkronkan data ke server begitu perangkat mendapatkan koneksi internet. Kami juga menyediakan integrasi WhatsApp Bot.",
  },
  {
    value: "onboarding",
    question: "Berapa lama proses implementasi dan integrasi armada?",
    answer:
      "Proses onboarding dapat diselesaikan dalam waktu kurang dari 30 menit. Anda dapat langsung mengunggah data armada kendaraan, master sopir, dan lokasi pool melalui fitur impor massal atau memasukkannya secara langsung di portal dashboard.",
  },
  {
    value: "security",
    question: "Bagaimana keamanan data armada dan transaksi perusahaan saya dijamin?",
    answer:
      "Setiap organisasi memiliki isolasi tenant tingkat database dengan enkripsi koneksi TLS 1.3, autentikasi berbasis JOSE JWT 256-bit, role-based access control 4-layer, serta audit trail logging lengkap untuk setiap aktivitas penambahan, pengubahan, dan penghapusan data.",
  },
];

export default function InteractiveFaq() {
  return (
    <section className="py-24 relative bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D6B5A]/10 border border-[#1D6B5A]/20 mb-3">
            <HelpCircle size={14} className="text-[#1D6B5A]" />
            <span className="font-ui text-xs font-semibold text-[#1D6B5A] tracking-wider uppercase">
              Tanya Jawab (FAQ)
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-[#1A1A18] tracking-tight mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="font-ui text-sm text-[#7A7A72]">
            Informasi lengkap mengenai kepatuhan regulasi, metodologi IPCC, dan implementasi platform Nawasanga.
          </p>
        </div>

        <Accordion
          variant="separated"
          radius="lg"
          defaultValue="methodology"
          styles={{
            item: {
              border: "1px solid rgba(29, 107, 90, 0.12)",
              backgroundColor: "#F7F5EF",
              marginBottom: 12,
            },
            control: {
              padding: "18px 22px",
              fontWeight: 600,
              fontSize: "15px",
              color: "#1A1A18",
            },
            panel: {
              padding: "0 22px 18px",
              color: "#7A7A72",
              fontSize: "14px",
              lineHeight: 1.6,
            },
          }}
        >
          {faqData.map((item) => (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.Control>{item.question}</Accordion.Control>
              <Accordion.Panel>{item.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
