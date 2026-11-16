"use client";

import { useState } from "react";
import { 
  Coins, 
  Leaf, 
  TrendingDown, 
  Trees, 
  ShieldCheck, 
  Zap, 
  Award, 
  Download, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@mantine/core";
import { toast } from "sonner";
import { exportToCsv } from "@/lib/export";

interface CarbonOffsetSimulatorProps {
  initialEmissionsTon?: number;
  organizationName?: string;
}

export function CarbonOffsetSimulator({
  initialEmissionsTon = 48.2,
  organizationName = "PT Sinergi Logistik Nusantara",
}: CarbonOffsetSimulatorProps) {
  const [emissionsTon, setEmissionsTon] = useState<number>(Math.max(10, Math.round(initialEmissionsTon)));
  const [offsetPricePerTon, setOffsetPricePerTon] = useState<number>(35000);
  const [projectType, setProjectType] = useState<"nbs" | "renewable" | "methane">("renewable");

  // Multiplier for project type
  const projectMultiplier = {
    nbs: 1.25,        // Nature-based mangrove conservation (premium)
    renewable: 1.0,   // Solar/Biomass SPE-GRK
    methane: 0.85,    // PKS effluent biogas capture
  }[projectType];

  const effectivePricePerTon = Math.round(offsetPricePerTon * projectMultiplier);
  const totalOffsetCostIdr = emissionsTon * effectivePricePerTon;

  // Nature equivalent metrics
  const treesEquivalent = Math.round(emissionsTon * 45); // 1 ton CO2 approx 45 mangrove trees lifetime absorption
  const landAreaHa = parseFloat((emissionsTon * 0.08).toFixed(1)); // hectares of conserved peatland

  // Decarbonization fuel scenarios
  const b40ReductionTon = parseFloat((emissionsTon * 0.143).toFixed(1));
  const b40CostSaving = Math.round(b40ReductionTon * effectivePricePerTon);

  const hvoReductionTon = parseFloat((emissionsTon * 0.85).toFixed(1));
  const hvoCostSaving = Math.round(hvoReductionTon * effectivePricePerTon);

  const evReductionTon = emissionsTon;
  const evCostSaving = totalOffsetCostIdr;

  const handleExportPathway = () => {
    const data = [
      {
        Parameter: "Organisasi",
        Nilai: organizationName,
      },
      {
        Parameter: "Baseline Emisi Scope 1",
        Nilai: `${emissionsTon} Ton CO₂e`,
      },
      {
        Parameter: "Tipe Sertifikat Karbon",
        Nilai: projectType === "nbs" ? "NBS Konservasi Mangrove (SPE-GRK)" : projectType === "renewable" ? "Energi Terbarukan Biomassa" : "Pengurangan Gas Metana PKS",
      },
      {
        Parameter: "Harga per Ton IDXCarbon",
        Nilai: `Rp ${effectivePricePerTon.toLocaleString("id-ID")}`,
      },
      {
        Parameter: "Total Estimasi Anggaran Offset",
        Nilai: `Rp ${totalOffsetCostIdr.toLocaleString("id-ID")}`,
      },
      {
        Parameter: "Penyetaraan Pohon Mangrove",
        Nilai: `${treesEquivalent.toLocaleString("id-ID")} Batang`,
      },
      {
        Parameter: "Potensi Pengurangan Mandatori B40",
        Nilai: `-${b40ReductionTon} Ton CO₂e (Hemat Rp ${b40CostSaving.toLocaleString("id-ID")})`,
      },
      {
        Parameter: "Potensi Pengurangan Green Diesel HVO",
        Nilai: `-${hvoReductionTon} Ton CO₂e (Hemat Rp ${hvoCostSaving.toLocaleString("id-ID")})`,
      },
      {
        Parameter: "Kepatuhan Regulasi",
        Nilai: "Perpres No. 98/2021 & POJK 51/2017",
      },
    ];

    exportToCsv("Peta-Jalan-Dekarbonisasi-IDXCarbon.csv", data);
    toast.success("Dokumen Peta Jalan Dekarbonisasi berhasil diekspor!");
  };

  return (
    <div className="rounded-2xl border border-[#1D6B5A]/25 bg-white p-6 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDEAE0] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#1D6B5A]/10 text-[#1D6B5A]">
              <Coins className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-gray-900">
              Simulator Dekarbonisasi &amp; Nilai Ekonomi Karbon (IDXCarbon)
            </h3>
            <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] bg-[#1D6B5A]/5 text-xs font-mono">
              Perpres 98/2021
            </Badge>
          </div>
          <p className="text-xs text-[#7A7A72]">
            Simulasikan biaya kredit karbon bursa IDXCarbon dan efisiensi pengalihan bahan bakar rendah emisi untuk kepatuhan POJK 51.
          </p>
        </div>

        <Button
          onClick={handleExportPathway}
          variant="outline"
          size="sm"
          className="h-9 text-xs border-[#1D6B5A]/30 text-[#1D6B5A] hover:bg-[#1D6B5A]/5 font-semibold shrink-0"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Peta Jalan (CSV)
        </Button>
      </div>

      {/* Control Sliders & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7 space-y-5 bg-[#F7F5EF]/60 p-5 rounded-2xl border border-[#EDEAE0]">
          {/* Slider 1: Emisi Scope 1 */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                Volume Emisi Scope 1 yang Di-offset
              </span>
              <span className="font-mono text-xs font-bold text-[#1D6B5A] px-2 py-0.5 rounded bg-white border border-[#DEDAD0]">
                {emissionsTon} Ton CO₂e
              </span>
            </div>
            <Slider
              value={emissionsTon}
              onChange={setEmissionsTon}
              min={5}
              max={250}
              step={1}
              color="#1D6B5A"
              marks={[
                { value: 10, label: "10t" },
                { value: 50, label: "50t" },
                { value: 120, label: "120t" },
                { value: 200, label: "200t" },
              ]}
              className="my-2"
            />
          </div>

          {/* Slider 2: Harga Kredit Karbon IDXCarbon */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-800">
                Benchmark Harga IDXCarbon per Ton (SPE-GRK)
              </span>
              <span className="font-mono text-xs font-bold text-[#B8962E] px-2 py-0.5 rounded bg-white border border-[#DEDAD0]">
                Rp {offsetPricePerTon.toLocaleString("id-ID")} / Ton
              </span>
            </div>
            <Slider
              value={offsetPricePerTon}
              onChange={setOffsetPricePerTon}
              min={20000}
              max={100000}
              step={5000}
              color="#B8962E"
              marks={[
                { value: 25000, label: "25rb" },
                { value: 35000, label: "35rb (Rerata)" },
                { value: 65000, label: "65rb" },
                { value: 90000, label: "90rb" },
              ]}
              className="my-2"
            />
          </div>

          {/* Project Type Selection */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-gray-800 block mb-2">
              Jenis Proyek Sertifikat Pengurangan Emisi (SPE-GRK):
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: "renewable", label: "Energi Terbarukan", note: "Biomassa / PLTM", factor: "1.0x" },
                { id: "nbs", label: "Konservasi Mangrove", note: "NBS Alam Pesisir", factor: "1.25x (Premi)" },
                { id: "methane", label: "Biogas PKS Sawit", note: "Limbah Cair Kelapa Sawit", factor: "0.85x" },
              ].map((p) => {
                const isSelected = projectType === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProjectType(p.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-[#1D6B5A] shadow-xs text-[#1D6B5A] font-semibold"
                        : "border-[#DEDAD0] bg-white/70 text-gray-600 hover:bg-white"
                    }`}
                  >
                    <div className="text-[11px] font-bold leading-tight">{p.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{p.note}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculation Result Dashboard Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1D6B5A] to-[#104238] text-white shadow-md relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                Estimasi Anggaran Kredit Karbon
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                IDXCarbon SPE
              </span>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-[#D4AF5A] tracking-tight">
                Rp {totalOffsetCostIdr.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Biaya netralisasi penuh untuk {emissionsTon} Ton CO₂e emisi Scope 1.
              </p>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-white/80">Harga Efektif Terpilih:</span>
              <span className="font-mono font-bold text-white">
                Rp {effectivePricePerTon.toLocaleString("id-ID")} / Ton
              </span>
            </div>
          </div>

          {/* Nature Based Equivalent Card */}
          <div className="p-4 rounded-xl border border-[#DEDAD0] bg-white space-y-2.5">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-[#1D6B5A]" /> Penyetaraan Serapan Alami (Insetting)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F5EF] border border-[#EDEAE0]">
                <span className="text-[10px] text-gray-500 block">Setara Reboisasi</span>
                <span className="text-sm font-bold text-[#1D6B5A]">
                  {treesEquivalent.toLocaleString("id-ID")} Pohon
                </span>
                <span className="text-[9px] text-gray-500 block">Mangrove pesisir</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F5EF] border border-[#EDEAE0]">
                <span className="text-[10px] text-gray-500 block">Restorasi Gambut</span>
                <span className="text-sm font-bold text-[#B8962E]">
                  {landAreaHa} Hektar
                </span>
                <span className="text-[9px] text-gray-500 block">Hutan rawa gambut</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Fuel Transition Scenarios */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#1D6B5A]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Skenario Transisi Bahan Bakar &amp; Penghematan Anggaran Offset
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Scenario 1: B40 */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-[#F7F5EF]/60 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-900">Mandatori Biodiesel B40</span>
              <Badge variant="outline" className="border-emerald-600/30 text-emerald-700 bg-emerald-50 text-[10px]">
                Regulasi 2025/2026
              </Badge>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Meningkatkan campuran Fatty Acid Methyl Ester (FAME) kelapa sawit dari 35% ke 40%.
            </p>
            <div className="pt-2 border-t border-[#EDEAE0] flex justify-between items-baseline text-xs">
              <span className="text-gray-500">Pangkas Emisi:</span>
              <span className="font-bold text-[#1D6B5A]">-{b40ReductionTon} Ton CO₂e</span>
            </div>
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-gray-500">Hemat Offset:</span>
              <span className="font-semibold text-emerald-700">Rp {b40CostSaving.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Scenario 2: HVO Green Diesel */}
          <div className="p-4 rounded-xl border border-[#1D6B5A]/20 bg-white space-y-2 shadow-xs">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#1D6B5A]">Green Diesel HVO (Pertamina)</span>
              <Badge className="bg-[#1D6B5A] text-white text-[10px]">
                High Impact
              </Badge>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Bahan bakar nabati murni hydrotreated tanpa sulfur, drop-in replacement mesin diesel euro 4/5.
            </p>
            <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline text-xs">
              <span className="text-gray-500">Pangkas Emisi:</span>
              <span className="font-bold text-[#1D6B5A]">-{hvoReductionTon} Ton CO₂e (-85%)</span>
            </div>
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-gray-500">Hemat Offset:</span>
              <span className="font-semibold text-emerald-700">Rp {hvoCostSaving.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Scenario 3: Commercial EV */}
          <div className="p-4 rounded-xl border border-[#EDEAE0] bg-[#F7F5EF]/60 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-900">Elektrifikasi EV Komersial</span>
              <Badge variant="outline" className="border-sky-500/30 text-sky-600 bg-sky-50 text-[10px]">
                Net Zero Tailpipe
              </Badge>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Penggantian truk perkotaan dan forklift gudang dengan kendaraan bertenaga baterai (BEV).
            </p>
            <div className="pt-2 border-t border-[#EDEAE0] flex justify-between items-baseline text-xs">
              <span className="text-gray-500">Pangkas Emisi:</span>
              <span className="font-bold text-sky-600">-{evReductionTon} Ton CO₂e (-100%)</span>
            </div>
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-gray-500">Hemat Offset:</span>
              <span className="font-semibold text-emerald-700">Rp {evCostSaving.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
