"use client";

import { useState } from "react";
import { Slider, SegmentedControl, Button, Paper, Badge, Group, Stack } from "@mantine/core";
import { Calculator, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function InteractiveCalculator() {
  const [fleetSize, setFleetSize] = useState(15);
  const [dailyKm, setDailyKm] = useState(80);
  const [fuelType, setFuelType] = useState<"solar" | "dexlite" | "pertamax">("solar");

  // Fuel efficiency approx (km/L) and Emission factors (kg CO2 / L)
  const fuelConfig = {
    solar: { factor: 2.68, kmPerLiter: 3.8, price: 6800, label: "Bio Solar B35" },
    dexlite: { factor: 2.65, kmPerLiter: 4.2, price: 14550, label: "Dexlite" },
    pertamax: { factor: 2.31, kmPerLiter: 8.5, price: 12950, label: "Pertamax" },
  };

  const selected = fuelConfig[fuelType];
  const monthlyKmPerVehicle = dailyKm * 26; // 26 operational days/month
  const totalMonthlyKm = monthlyKmPerVehicle * fleetSize;
  const monthlyLiters = Math.round(totalMonthlyKm / selected.kmPerLiter);
  const monthlyCostIdr = monthlyLiters * selected.price;
  const monthlyCo2Ton = parseFloat(((monthlyLiters * selected.factor) / 1000).toFixed(2));
  const potentialSavingsTon = parseFloat((monthlyCo2Ton * 0.12).toFixed(2)); // 12% eco-driving & route optimization

  return (
    <section id="kalkulator" className="py-24 relative bg-[#F7F5EF] border-t border-b border-[#1D6B5A]/15">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D6B5A]/10 border border-[#1D6B5A]/20 mb-3">
            <Calculator size={14} className="text-[#1D6B5A]" />
            <span className="font-ui text-xs font-semibold text-[#1D6B5A] tracking-wider uppercase">
              Kalkulator Interaktif
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-[#1A1A18] tracking-tight mb-3">
            Simulasikan Penghematan BBM & Emisi Armada Anda
          </h2>
          <p className="font-ui text-sm text-[#7A7A72] max-w-xl mx-auto">
            Gunakan penggeser di bawah untuk melihat estimasi konsumsi bahan bakar, biaya operasional, dan jejak karbon bulanan secara real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-[#1D6B5A]/15 shadow-sm space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A18]">Jumlah Kendaraan / Aset Armada</label>
                <Badge color="#1D6B5A" variant="filled" size="lg" radius="sm">
                  {fleetSize} Unit
                </Badge>
              </div>
              <Slider
                value={fleetSize}
                onChange={setFleetSize}
                min={1}
                max={150}
                step={1}
                color="#1D6B5A"
                marks={[
                  { value: 5, label: "5" },
                  { value: 30, label: "30" },
                  { value: 75, label: "75" },
                  { value: 120, label: "120" },
                ]}
                className="my-3"
              />
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A18]">Jarak Tempuh Rata-rata per Hari</label>
                <Badge color="#B8962E" variant="filled" size="lg" radius="sm">
                  {dailyKm} km/hari
                </Badge>
              </div>
              <Slider
                value={dailyKm}
                onChange={setDailyKm}
                min={10}
                max={300}
                step={5}
                color="#B8962E"
                marks={[
                  { value: 30, label: "30km" },
                  { value: 100, label: "100km" },
                  { value: 200, label: "200km" },
                ]}
                className="my-3"
              />
            </div>

            <div className="pt-2">
              <label className="text-sm font-semibold text-[#1A1A18] block mb-2">Jenis Bahan Bakar Utama</label>
              <SegmentedControl
                value={fuelType}
                onChange={(val) => setFuelType(val as any)}
                color="#1D6B5A"
                fullWidth
                data={[
                  { label: "Bio Solar B35", value: "solar" },
                  { label: "Dexlite", value: "dexlite" },
                  { label: "Pertamax", value: "pertamax" },
                ]}
                className="border border-[#1D6B5A]/20"
              />
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="md:col-span-5 bg-[#1D6B5A] text-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[#D4AF5A] font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} /> Estimasi Bulanan
                </span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                  IPCC 2006 Standard
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <span className="text-xs text-white/70 block mb-0.5">Total Emisi Karbon Aktual</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#D4AF5A] font-display">
                      {monthlyCo2Ton.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-white/80 font-medium">Ton CO₂e / bln</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-white/70 block">Konsumsi BBM</span>
                    <span className="text-lg font-bold">{monthlyLiters.toLocaleString("id-ID")} L</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-white/70 block">Estimasi Biaya</span>
                    <span className="text-lg font-bold">
                      Rp {(monthlyCostIdr / 1000000).toFixed(1)} Jt
                    </span>
                  </div>
                </div>

                <div className="bg-[#2A9478]/30 p-3 rounded-xl border border-[#2A9478]/50 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-[#D4AF5A] shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold block text-white">Potensi Reduksi Emisi:</span>
                    <span className="text-white/80">
                      Hingga <strong>{potentialSavingsTon} Ton CO₂e</strong> dengan optimasi rute Nawasanga.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/kyc?plan=pro"
              className="w-full text-center bg-[#D4AF5A] hover:bg-[#B8962E] text-[#1A1A18] font-bold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              Mulai Monitor di Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
