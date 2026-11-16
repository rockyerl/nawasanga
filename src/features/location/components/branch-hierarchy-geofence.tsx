"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CloudRain, 
  Radio, 
  Compass, 
  AlertTriangle,
  CheckCircle2,
  Phone,
  Layers,
  Fuel,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BranchSiteItem {
  id: string;
  name: string;
  type: "Pool" | "Site" | "Branch" | "Depot";
  city: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  geofenceRadiusKm: number;
  assignedFleetCount: number;
  monthlyLiters: number;
  scope1TonCO2e: number;
  picName: string;
  picPhone: string;
  geofenceStatus: "valid" | "warning";
  routeCorridor: string;
}

const DEFAULT_BRANCHES: BranchSiteItem[] = [
  {
    id: "loc_cakung",
    name: "Pool Logistik Cakung (Hub Utama)",
    type: "Pool",
    city: "Jakarta Timur",
    province: "DKI Jakarta",
    address: "Kawasan Industri Pulo Gadung, Jl. Raya Cakung No. 88",
    lat: -6.1824,
    lng: 106.9451,
    geofenceRadiusKm: 5.0,
    assignedFleetCount: 28,
    monthlyLiters: 34500,
    scope1TonCO2e: 91.42,
    picName: "Budi Hartono",
    picPhone: "0812-8899-1234",
    geofenceStatus: "valid",
    routeCorridor: "Koridor Tol Jakarta - Cikampek - Cipali",
  },
  {
    id: "loc_morowali",
    name: "Site Tambang Morowali (Site 01)",
    type: "Site",
    city: "Morowali",
    province: "Sulawesi Tengah",
    address: "Kawasan Industri Pertambangan Bahodopi",
    lat: -2.8123,
    lng: 122.1482,
    geofenceRadiusKm: 25.0,
    assignedFleetCount: 18,
    monthlyLiters: 48200,
    scope1TonCO2e: 127.73,
    picName: "Wahyu Pratama",
    picPhone: "0813-7744-9988",
    geofenceStatus: "valid",
    routeCorridor: "Hauling Road Pit Bahodopi ke Smelter Jetty",
  },
  {
    id: "loc_cilegon",
    name: "Pool Cilegon (Branch Logistik)",
    type: "Branch",
    city: "Cilegon",
    province: "Banten",
    address: "Jl. Akses Pelabuhan Merak KM 4, Ciwandan",
    lat: -6.0128,
    lng: 105.9872,
    geofenceRadiusKm: 8.0,
    assignedFleetCount: 12,
    monthlyLiters: 16800,
    scope1TonCO2e: 44.52,
    picName: "Samsul Bahri",
    picPhone: "0856-4321-7788",
    geofenceStatus: "valid",
    routeCorridor: "Koridor Merak - Cilegon Timur - Balaraja",
  },
  {
    id: "loc_pelalawan",
    name: "Site Sawit Pelalawan (Agro Site)",
    type: "Site",
    city: "Pelalawan",
    province: "Riau",
    address: "Kawasan Perkebunan Sawit Blok C, Pangkalan Kerinci",
    lat: 0.3541,
    lng: 101.8542,
    geofenceRadiusKm: 15.0,
    assignedFleetCount: 10,
    monthlyLiters: 14200,
    scope1TonCO2e: 37.63,
    picName: "Hendro Kusumo",
    picPhone: "0821-6655-1122",
    geofenceStatus: "valid",
    routeCorridor: "Estate Kebun ke Pabrik Kelapa Sawit (PKS)",
  },
];

export function BranchHierarchyGeofence() {
  const [selectedBranch, setSelectedBranch] = useState<BranchSiteItem>(DEFAULT_BRANCHES[0]);

  const totalBranches = DEFAULT_BRANCHES.length;
  const totalFleet = DEFAULT_BRANCHES.reduce((acc, curr) => acc + curr.assignedFleetCount, 0);
  const totalEmissions = DEFAULT_BRANCHES.reduce((acc, curr) => acc + curr.scope1TonCO2e, 0);
  const totalLiters = DEFAULT_BRANCHES.reduce((acc, curr) => acc + curr.monthlyLiters, 0);

  return (
    <div className="space-y-6">
      {/* 4 Multi-Branch KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EDEAE0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Cabang &amp; Pool Aktif</span>
            <div className="p-2 rounded-xl bg-[#1D6B5A]/10 text-[#1D6B5A]">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalBranches}</span>
            <span className="text-xs text-gray-500">Titik Geofence</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            ● 100% Perimeter Monitoring Aktif
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDEAE0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Armada Terdistribusi</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalFleet}</span>
            <span className="text-xs text-gray-500">Unit Tersebar</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            Truk Logistik, Tangki &amp; Alat Berat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDEAE0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total Konsumsi BBM</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Fuel size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalLiters.toLocaleString("id-ID")}</span>
            <span className="text-xs text-gray-500">Liter</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <TrendingDown size={11} /> 14.2% Efisiensi vs Bulan Lalu
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDEAE0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Emisi Scope 1 Terkonsolidasi</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CloudRain size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#1D6B5A]">{totalEmissions.toFixed(1)}</span>
            <span className="text-xs text-gray-500">Ton CO₂e</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            Audit Ready IPCC Tier-2 Formula
          </span>
        </div>
      </div>

      {/* Main Hierarchy & Geofencing Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: Branch Sites */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Daftar Cabang, Pool &amp; Site
            </span>
            <span className="text-[11px] text-gray-500">Pilih untuk detail geofence</span>
          </div>

          <div className="space-y-2.5">
            {DEFAULT_BRANCHES.map((b) => {
              const isSelected = selectedBranch.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBranch(b)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#1D6B5A] bg-[#1D6B5A]/5 shadow-sm"
                      : "border-[#EDEAE0] bg-white hover:border-[#1D6B5A]/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{b.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold ${
                            b.type === "Pool"
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : b.type === "Site"
                              ? "border-emerald-300 text-emerald-800 bg-emerald-50"
                              : "border-purple-300 text-purple-700 bg-purple-50"
                          }`}
                        >
                          {b.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={11} className="text-gray-400" />
                        {b.city}, {b.province}
                      </p>
                    </div>
                    <ChevronRight size={16} className={isSelected ? "text-[#1D6B5A]" : "text-gray-300"} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Armada</span>
                      <span className="font-bold text-gray-900">{b.assignedFleetCount} Unit</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Radius Geofence</span>
                      <span className="font-bold text-[#1D6B5A]">{b.geofenceRadiusKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Emisi Scope 1</span>
                      <span className="font-bold text-gray-900">{b.scope1TonCO2e} tCO₂e</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail: Active Geofencing & Corridor Map Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EDEAE0] p-6 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEAE0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-gray-900">
                  {selectedBranch.name}
                </h3>
                <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 text-[10px] font-bold">
                  Geofence Aktif
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{selectedBranch.address}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#1D6B5A] px-2.5 py-1 rounded-lg bg-[#1D6B5A]/10 border border-[#1D6B5A]/20">
                {selectedBranch.lat}, {selectedBranch.lng}
              </span>
            </div>
          </div>

          {/* Visual Geofence Radar Representation */}
          <div className="relative rounded-2xl overflow-hidden border border-[#DEDAD0] bg-neutral-900 p-6 text-white min-h-[220px] flex flex-col justify-between">
            {/* Background subtle coordinate grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
              backgroundImage: "radial-gradient(#2A9478 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }} />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  SENTINEL GEOFENCE PERIMETER
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Radius Proteksi: {selectedBranch.geofenceRadiusKm} KM
              </span>
            </div>

            {/* Central Radar Visual */}
            <div className="relative z-10 my-4 text-center space-y-2">
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full border border-emerald-400/60 bg-emerald-400/20 flex items-center justify-center">
                  <Compass size={24} className="text-emerald-300 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-xs font-semibold text-emerald-300 block">
                {selectedBranch.assignedFleetCount} Unit Armada Terpantau Dalam Koridor
              </span>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800 pt-3">
              <span>Koridor Resmi: <strong className="text-white">{selectedBranch.routeCorridor}</strong></span>
              <span className="text-emerald-400 font-semibold">0 Anomali Dilaporkan</span>
            </div>
          </div>

          {/* Operational Metrics & PIC Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#EDEAE0] space-y-2">
              <span className="text-xs font-bold text-gray-800 block">Penanggung Jawab Lapangan (PIC)</span>
              <div className="text-xs space-y-1">
                <div className="font-semibold text-gray-900">{selectedBranch.picName}</div>
                <div className="text-gray-600 flex items-center gap-1.5 font-mono text-[11px]">
                  <Phone size={12} className="text-gray-400" />
                  {selectedBranch.picPhone}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1D6B5A]/5 border border-[#1D6B5A]/20 space-y-2">
              <span className="text-xs font-bold text-[#1D6B5A] block">Konsumsi BBM &amp; Emisi Bulan Ini</span>
              <div className="text-xs space-y-1">
                <div className="text-gray-700">
                  Konsumsi: <strong className="text-gray-900">{selectedBranch.monthlyLiters.toLocaleString("id-ID")} Liter</strong>
                </div>
                <div className="text-gray-700">
                  Emisi Scope 1: <strong className="text-[#1D6B5A]">{selectedBranch.scope1TonCO2e} Ton CO₂e</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
