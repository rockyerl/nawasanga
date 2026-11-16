"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Fuel, 
  Gauge, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Truck, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  DollarSign,
  CloudRain,
  Smartphone,
  Search,
  QrCode,
  Building2,
  Check,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface VehicleItem {
  id: string;
  name?: string;
  brandModel: string;
  plateNumber: string;
  fuelType?: string;
  fuelTypeId?: string;
  category?: string;
  currentOdometer?: number;
  organizationId?: string;
  organizationName?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
}

const LOCAL_STORAGE_KEY = "nawasanga_active_driver_vehicle";

export function DriverMobileLogView() {
  const searchParams = useSearchParams();
  const prefilledVehicleId = searchParams.get("vehicleId") || "";

  // Active Vehicle & Identification State
  const [activeVehicle, setActiveVehicle] = useState<VehicleItem | null>(null);
  const [isSearchingVehicle, setIsSearchingVehicle] = useState(false);
  const [searchPlateQuery, setSearchPlateQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VehicleItem[]>([]);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  // Form fields
  const [driverName, setDriverName] = useState("");
  const [liters, setLiters] = useState("");
  const [odometer, setOdometer] = useState("");
  const [spbuName, setSpbuName] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [odometerImage, setOdometerImage] = useState<string | null>(null);

  // Geolocation & UX state
  const [locationDetecting, setLocationDetecting] = useState(false);
  const [locationCoord, setLocationCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Submission feedback
  const [submittedData, setSubmittedData] = useState<{
    liters: number;
    cost: number;
    emissionCo2Kg: number;
    plateNumber: string;
    fuelType: string;
    organizationName: string;
    driverName: string;
  } | null>(null);

  // Helper to activate and persist a vehicle
  const selectAndSaveVehicle = useCallback((v: VehicleItem) => {
    setActiveVehicle(v);
    setIsSearchingVehicle(false);
    if (v.assignedDriverName && !driverName) {
      setDriverName(v.assignedDriverName);
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(v));
    } catch {
      // LocalStorage might be disabled in private mode
    }
    toast.success(`Armada terhubung: ${v.plateNumber} (${v.organizationName || "Terdaftar"})`);
  }, [driverName]);

  // Load vehicle: Check URL params first, then fallback to LocalStorage
  useEffect(() => {
    async function initVehicle() {
      // Priority 1: vehicleId in URL (from scanning QR sticker on dashboard)
      if (prefilledVehicleId) {
        try {
          setIsLookupLoading(true);
          const res = await fetch(`/api/internal/vehicles/${prefilledVehicleId}`);
          if (res.ok) {
            const json = await res.json();
            if (json?.data) {
              selectAndSaveVehicle(json.data);
              return;
            }
          }
        } catch (err) {
          console.error("Gagal memuat kendaraan dari QR URL:", err);
        } finally {
          setIsLookupLoading(false);
        }
      }

      // Priority 2: Recall from LocalStorage (if driver previously used this phone)
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.id && parsed?.plateNumber) {
            setActiveVehicle(parsed);
            if (parsed.assignedDriverName) {
              setDriverName(parsed.assignedDriverName);
            }
            return;
          }
        }
      } catch {
        // Ignore JSON error
      }

      // Priority 3: Fallback default (open unit search prompt if nothing found)
      setIsSearchingVehicle(true);
    }

    initVehicle();
  }, [prefilledVehicleId, selectAndSaveVehicle]);

  // Search vehicles by plate number or model
  const handleSearchVehicle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchPlateQuery.trim();
    if (!query) {
      toast.error("Ketik nomor plat atau model kendaraan");
      return;
    }

    setIsLookupLoading(true);
    try {
      const res = await fetch(`/api/internal/vehicles?search=${encodeURIComponent(query)}&itemPerPage=10`);
      const json = await res.json();
      if (json?.data?.items && json.data.items.length > 0) {
        setSearchResults(json.data.items);
      } else {
        setSearchResults([]);
        toast.info("Tidak ada kendaraan yang cocok dengan nomor plat tersebut.");
      }
    } catch {
      toast.error("Gagal mencari kendaraan. Periksa koneksi internet.");
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Geolocation trigger
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser ponsel tidak mendukung geolokasi GPS");
      return;
    }

    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationDetecting(false);
        setLocationCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSpbuName(`SPBU GPS [${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}]`);
        toast.success("Koordinat GPS SPBU berhasil dideteksi!");
      },
      (err) => {
        setLocationDetecting(false);
        toast.error("Gagal mendeteksi lokasi GPS: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Image capture handlers
  const handleReceiptPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        toast.success("Foto struk kasir berhasil diambil");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOdometerPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOdometerImage(reader.result as string);
        toast.success("Foto odometer dasbor berhasil diambil");
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeVehicle) {
      toast.error("Pilih armada kendaraan terlebih dahulu");
      setIsSearchingVehicle(true);
      return;
    }

    const numLiters = parseFloat(liters);
    if (!numLiters || numLiters <= 0) {
      toast.error("Masukkan volume bahan bakar yang valid (Liter)");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        vehicleId: activeVehicle.id,
        liters: numLiters,
        odometerKm: odometer ? parseInt(odometer, 10) : undefined,
        fuelStation: spbuName.trim() || "SPBU Pertamina Terdekat",
        receiptImageUrl: receiptImage || undefined,
        notes: notes ? `${notes} (Input via Mobile Driver Log)` : "Input via Mobile Driver Log PWA",
        driverName: driverName.trim() || activeVehicle.assignedDriverName || "Driver Lapangan",
        latitude: locationCoord?.lat,
        longitude: locationCoord?.lng,
      };

      const res = await fetch("/api/internal/fuel-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Gagal mencatat transaksi BBM");
      }

      const estCost = Math.round(numLiters * 14550);
      const estEmission = parseFloat((numLiters * 2.65).toFixed(2));

      setSubmittedData({
        liters: numLiters,
        cost: estCost,
        emissionCo2Kg: estEmission,
        plateNumber: activeVehicle.plateNumber,
        fuelType: activeVehicle.fuelType || "Bio Solar B35",
        organizationName: activeVehicle.organizationName || json.data?.organizationName || "Perusahaan Mitra",
        driverName: driverName.trim() || activeVehicle.assignedDriverName || "Driver Lapangan",
      });

      toast.success("Log transaksi BBM berhasil dicatat!");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  // ── SCREEN 1: SUCCESS STATE ────────────────────────────────────────────────
  if (submittedData) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-[#1D6B5A]/20 shadow-xl p-6 text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D6B5A]">
              Terkonfirmasi &amp; Siap Audit
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1A1A18] mt-1">
              Catatan BBM Berhasil!
            </h2>
            <p className="text-xs text-[#7A7A72] mt-1">
              Unit <strong className="text-gray-900">{submittedData.plateNumber}</strong> • {submittedData.fuelType}
            </p>
            
            {/* Visual Tenant Confirmation Badge */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D6B5A]/10 text-[#1D6B5A] text-xs font-semibold border border-[#1D6B5A]/20">
              <Building2 size={13} className="text-[#1D6B5A]" />
              <span>Tercatat di: <strong>{submittedData.organizationName}</strong></span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#EDEAE0]">
              <span className="text-[10px] text-gray-500 block">Volume Pengisian</span>
              <span className="text-lg font-bold text-gray-900">{submittedData.liters} L</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#EDEAE0]">
              <span className="text-[10px] text-gray-500 block">Estimasi Biaya</span>
              <span className="text-lg font-bold text-gray-900">Rp {submittedData.cost.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1D6B5A]/5 border border-[#1D6B5A]/20 text-left flex items-center gap-3">
            <CloudRain className="w-6 h-6 text-[#1D6B5A] shrink-0" />
            <div>
              <span className="text-[10px] text-[#1D6B5A] font-semibold block uppercase tracking-wider">
                Emisi Karbon Scope 1 Terinventarisasi
              </span>
              <span className="text-base font-bold text-[#1D6B5A]">
                {submittedData.emissionCo2Kg} kg CO₂e
              </span>
              <span className="text-[10px] text-gray-500 block">
                Pengemudi: {submittedData.driverName} (Tanpa Login)
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={() => {
                setSubmittedData(null);
                setLiters("");
                setOdometer("");
                setReceiptImage(null);
                setOdometerImage(null);
              }}
              className="w-full h-11 bg-[#1D6B5A] hover:bg-[#175749] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <RotateCcw size={14} className="mr-1.5" /> Catat Transaksi Baru
            </Button>

            <Link
              href="/dashboard"
              className="w-full h-10 border border-[#DEDAD0] bg-white text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center hover:bg-neutral-50"
            >
              Kembali ke Dashboard Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN 2: VEHICLE LOOKUP GATE (When no vehicle active or driver clicks "Ganti Armada") ──
  if (isSearchingVehicle || !activeVehicle) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] py-4 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#1D6B5A]/20 shadow-xl overflow-hidden flex flex-col animate-fade-in">
          {/* Header */}
          <div className="bg-[#1D6B5A] text-white p-5 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center font-bold text-xs text-[#D4AF5A]">
                N
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                IDENTIFIKASI ARMADA
              </span>
            </div>
            <h1 className="font-display text-xl font-bold pt-1">
              Pilih Kendaraan Anda
            </h1>
            <p className="text-[11px] text-white/85 leading-tight">
              Supir tidak perlu login. Cukup ketik nomor polisi mobil Anda atau scan stiker dasbor.
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Search Input Box */}
            <form onSubmit={handleSearchVehicle} className="space-y-2">
              <Label className="text-xs font-semibold text-gray-700">
                Nomor Polisi / Plat Kendaraan
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="cth: B 9102 UX"
                    value={searchPlateQuery}
                    onChange={(e) => setSearchPlateQuery(e.target.value.toUpperCase())}
                    className="h-11 text-sm font-mono uppercase bg-[#F7F5EF] border-[#DEDAD0] rounded-xl pr-8"
                  />
                  {searchPlateQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchPlateQuery("")}
                      className="absolute right-2.5 top-3 text-xs text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLookupLoading}
                  className="h-11 px-4 bg-[#1D6B5A] hover:bg-[#175749] text-white rounded-xl text-xs font-bold"
                >
                  <Search size={14} className="mr-1" />
                  {isLookupLoading ? "Mencari..." : "Cari"}
                </Button>
              </div>
            </form>

            {/* Matching Results List */}
            {searchResults.length > 0 && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <span className="text-[11px] font-bold text-gray-600 block">
                  Pilih Kendaraan Anda ({searchResults.length} ditemukan):
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {searchResults.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => selectAndSaveVehicle(v)}
                      className="p-3.5 rounded-2xl border border-[#EDEAE0] bg-[#FAF8F5] hover:bg-[#1D6B5A]/5 hover:border-[#1D6B5A]/30 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-extrabold text-gray-900">
                            {v.plateNumber}
                          </span>
                          <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] text-[9px] font-bold">
                            {v.fuelType || "Bio Solar"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {v.brandModel}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1D6B5A]">
                          <Building2 size={11} />
                          <span>{v.organizationName || "PT Nusantara Logistik"}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-[#1D6B5A] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Windshield QR Sticker Instructions */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <QrCode size={16} className="text-amber-800" />
                <span>Punya Stiker QR di Dasbor Mobil?</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Arahkan kamera smartphone Anda ke <strong>Stiker QR Dasbor</strong> di kaca depan truk Anda. Form pencatatan akan langsung terhubung ke mobil &amp; PT Anda tanpa perlu mencari plat secara manual!
              </p>
            </div>

            {/* Cancel / Back to active if one was already set */}
            {activeVehicle && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSearchingVehicle(false)}
                className="w-full h-10 text-xs border-[#DEDAD0] text-gray-700 rounded-xl cursor-pointer"
              >
                Kembali ke Unit Sebelumnya ({activeVehicle.plateNumber})
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN 3: FAST FUEL LOGGING FORM ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F5EF] py-4 px-4 flex flex-col items-center justify-center">
      {/* Smartphone Viewport Frame */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#1D6B5A]/20 shadow-xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-[#1D6B5A] text-white p-5 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center font-bold text-xs text-[#D4AF5A]">
                N
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                DRIVER MOBILE LOG
              </span>
            </div>
            <Badge variant="outline" className="border-white/30 text-white text-[10px] bg-white/10 font-mono">
              PWA Fast-Sync
            </Badge>
          </div>

          <h1 className="font-display text-xl font-bold pt-1">
            Catat Pengisian Bahan Bakar
          </h1>
          <p className="text-[11px] text-white/80 leading-tight">
            Foto struk SPBU &amp; odometer untuk verifikasi audit anti-fraud.
          </p>
        </div>

        {/* PWA Install Guide Banner */}
        <div className="bg-[#FAF8F5] border-b border-[#DEDAD0] px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#1D6B5A]" />
            <span className="text-[11px] font-semibold text-gray-800">
              Pasang ke Layar Utama HP (PWA)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowInstallGuide(!showInstallGuide)}
            className="text-[11px] font-bold text-[#1D6B5A] hover:underline cursor-pointer"
          >
            {showInstallGuide ? "Tutup Panduan" : "Cara Pasang →"}
          </button>
        </div>

        {showInstallGuide && (
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 text-xs space-y-2 animate-fade-in">
            <p className="font-bold text-emerald-950 text-[11px]">
              Tanpa Perlu Unduh di Google Play Store / App Store:
            </p>
            <div className="space-y-1.5 text-[11px] text-gray-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#1D6B5A]">• Android (Chrome):</span>
                <span>Tekan titik tiga (⋮) di kanan atas &rarr; pilih <strong>&quot;Tambahkan ke Layar Utama&quot;</strong> atau <strong>&quot;Instal Aplikasi&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#1D6B5A]">• iPhone (Safari):</span>
                <span>Tekan tombol <strong>Bagikan (Share)</strong> &rarr; pilih <strong>&quot;Add to Home Screen&quot;</strong>.</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 italic">
              Aplikasi akan muncul langsung di layar HP dan dapat dibuka layar penuh dengan 1 klik.
            </p>
          </div>
        )}

        {/* Active Vehicle & Verified Tenant Banner */}
        <div className="p-4 bg-[#EDEAE0]/40 border-b border-[#DEDAD0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#DEDAD0] text-[#1D6B5A] shadow-xs">
              <Truck size={20} />
            </div>
            <div>
              {/* Organization Identification */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#1D6B5A]">
                <Building2 size={12} />
                <span>{activeVehicle.organizationName || "PT Nusantara Logistik"}</span>
              </div>
              <span className="text-base font-extrabold text-gray-900 font-mono block">
                {activeVehicle.plateNumber}
              </span>
              <span className="text-xs text-gray-600 block">
                {activeVehicle.brandModel}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] bg-white text-[10px] font-bold">
              {activeVehicle.fuelType || "Bio Solar"}
            </Badge>
            <button
              type="button"
              onClick={() => {
                setSearchResults([]);
                setSearchPlateQuery("");
                setIsSearchingVehicle(true);
              }}
              className="text-[10px] font-bold text-[#1D6B5A] hover:underline cursor-pointer"
            >
              Ganti Armada →
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Pengemudi */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">Nama Pengemudi / Operator</Label>
              {activeVehicle.assignedDriverName && (
                <span className="text-[10px] text-[#1D6B5A] font-semibold">
                  Driver Tetap: {activeVehicle.assignedDriverName}
                </span>
              )}
            </div>
            <Input
              type="text"
              placeholder="cth: Agus Santoso"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0] rounded-xl"
            />
          </div>

          {/* Volume BBM & Odometer (Big Touch Friendly) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <Fuel size={13} className="text-[#1D6B5A]" /> Volume (Liter) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="cth: 120"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                required
                className="h-12 text-base font-bold bg-[#F7F5EF] border-[#DEDAD0] rounded-xl text-center focus:border-[#1D6B5A]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Gauge size={13} className="text-gray-500" /> Odometer (km)
              </Label>
              <Input
                type="number"
                placeholder="cth: 84500"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="h-12 text-base font-mono bg-[#F7F5EF] border-[#DEDAD0] rounded-xl text-center focus:border-[#1D6B5A]"
              />
            </div>
          </div>

          {/* Kamera: Foto Struk Kasir & Foto Odometer */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Foto Struk */}
            <div>
              <Label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Foto Struk Kasir SPBU
              </Label>
              <label className="relative flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-[#1D6B5A]/30 bg-[#F7F5EF]/60 hover:bg-[#F7F5EF] cursor-pointer overflow-hidden transition-colors">
                {receiptImage ? (
                  <img src={receiptImage} alt="Struk" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 p-2 text-center text-[#1D6B5A]">
                    <Camera size={22} />
                    <span className="text-[10px] font-bold">Ambil Foto Struk</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleReceiptPhoto}
                  className="hidden"
                />
              </label>
            </div>

            {/* Foto Odometer */}
            <div>
              <Label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Foto Odometer Dasbor
              </Label>
              <label className="relative flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F7F5EF]/60 hover:bg-[#F7F5EF] cursor-pointer overflow-hidden transition-colors">
                {odometerImage ? (
                  <img src={odometerImage} alt="Odometer" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 p-2 text-center text-gray-600">
                    <Camera size={22} />
                    <span className="text-[10px] font-semibold">Ambil Foto Odo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleOdometerPhoto}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* GPS Auto-Detect Button */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700">Nama SPBU / Lokasi Pengisian</Label>
              <button
                type="button"
                onClick={detectLocation}
                disabled={locationDetecting}
                className="text-[11px] font-bold text-[#1D6B5A] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <MapPin size={12} />
                {locationDetecting ? "Mendeteksi..." : "Gunakan GPS HP"}
              </button>
            </div>
            <Input
              type="text"
              placeholder="cth: SPBU Pertamina Rest Area KM 57"
              value={spbuName}
              onChange={(e) => setSpbuName(e.target.value)}
              className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0] rounded-xl"
            />
          </div>

          {/* Catatan / Keterangan */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Catatan Tambahan (Opsional)</Label>
            <Input
              type="text"
              placeholder="cth: Perjalanan rute Surabaya - Jakarta muatan penuh"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10 text-xs bg-[#F7F5EF] border-[#DEDAD0] rounded-xl"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1D6B5A] hover:bg-[#175749] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Menyimpan ke Sistem {activeVehicle.organizationName || "PT"}...</span>
              ) : (
                <>
                  <ShieldCheck size={16} /> Simpan Log Transaksi BBM
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
