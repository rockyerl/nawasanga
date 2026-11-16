"use client";

import { useState, useEffect } from "react";
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
  CloudRain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface VehicleItem {
  id: string;
  name: string;
  brandModel: string;
  plateNumber: string;
  fuelType?: string;
  fuelTypeId?: string;
  category?: string;
  currentOdometer?: number;
}

export function DriverMobileLogView() {
  const searchParams = useSearchParams();
  const prefilledVehicleId = searchParams.get("vehicleId") || "";

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(prefilledVehicleId);
  const [driverName, setDriverName] = useState("");
  const [liters, setLiters] = useState("");
  const [odometer, setOdometer] = useState("");
  const [spbuName, setSpbuName] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [odometerImage, setOdometerImage] = useState<string | null>(null);

  const [locationDetecting, setLocationDetecting] = useState(false);
  const [locationCoord, setLocationCoord] = useState<{ lat: number; lng: number } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    liters: number;
    cost: number;
    emissionCo2Kg: number;
    plateNumber: string;
    fuelType: string;
  } | null>(null);

  // Fetch active vehicles on load
  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await fetch("/api/internal/vehicles?itemPerPage=100");
        const json = await res.json();
        if (json?.data?.items) {
          setVehicles(json.data.items);
          if (prefilledVehicleId) {
            setSelectedVehicleId(prefilledVehicleId);
          } else if (json.data.items.length > 0) {
            setSelectedVehicleId(json.data.items[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      }
    }
    loadVehicles();
  }, [prefilledVehicleId]);

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Geolocation trigger
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser tidak mendukung geolokasi GPS");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      toast.error("Pilih armada kendaraan");
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
        vehicleId: selectedVehicleId,
        liters: numLiters,
        odometerKm: odometer ? parseInt(odometer, 10) : undefined,
        fuelStation: spbuName.trim() || "SPBU Pertamina Terdekat",
        receiptImageUrl: receiptImage || undefined,
        notes: notes ? `${notes} (Input via Mobile Driver Log)` : "Input via Mobile Driver Log PWA",
        driverName: driverName.trim() || "Driver Lapangan",
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

      // Success feedback state
      const estCost = Math.round(numLiters * 14550);
      const estEmission = parseFloat((numLiters * 2.65).toFixed(2));

      setSubmittedData({
        liters: numLiters,
        cost: estCost,
        emissionCo2Kg: estEmission,
        plateNumber: activeVehicle?.plateNumber || "Armada",
        fuelType: activeVehicle?.fuelType || "Bio Solar B35",
      });

      toast.success("Log transaksi BBM berhasil dicatat!");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  // ── Success State Screen ──
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
              Unit {submittedData.plateNumber} • {submittedData.fuelType}
            </p>
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
                Emisi Karbon Terinventarisasi
              </span>
              <span className="text-base font-bold text-[#1D6B5A]">
                {submittedData.emissionCo2Kg} kg CO₂e
              </span>
              <span className="text-[10px] text-gray-500 block">
                Faktor Emisi IPCC 2006 GWP AR6
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
              className="w-full h-11 bg-[#1D6B5A] hover:bg-[#175749] text-white text-xs font-bold rounded-xl"
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

        {/* Active Vehicle Banner */}
        <div className="p-4 bg-[#EDEAE0]/40 border-b border-[#DEDAD0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#DEDAD0] text-[#1D6B5A]">
              <Truck size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
                Armada Terpilih
              </span>
              <span className="text-base font-extrabold text-gray-900 font-mono">
                {activeVehicle?.plateNumber || "Pilih Armada"}
              </span>
              <span className="text-xs text-gray-600 block">
                {activeVehicle?.brandModel || activeVehicle?.name}
              </span>
            </div>
          </div>

          <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] bg-white text-[10px] font-bold">
            {activeVehicle?.fuelType || "Bio Solar"}
          </Badge>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Switch Vehicle if not preset */}
          {!prefilledVehicleId && vehicles.length > 1 && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Pilih Kendaraan Lain</Label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#F7F5EF] border border-[#DEDAD0] rounded-xl focus:outline-[#1D6B5A]"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} — {v.brandModel}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pengemudi */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Nama Pengemudi / Operator</Label>
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

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1D6B5A] hover:bg-[#175749] text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Menyimpan &amp; Memverifikasi...</span>
              ) : (
                <>
                  <ShieldCheck size={16} /> Kirim Log Transaksi BBM
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
