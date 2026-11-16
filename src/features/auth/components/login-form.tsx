"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Server, 
  Activity,
  AlertCircle,
  Cpu,
  Layers
} from "lucide-react";
import { loginAction } from "@/features/auth/actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  
  // Production: Credentials start empty (No mock data in production)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);
      const res = await loginAction(formData);

      if (res.success) {
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const redirectParam = searchParams?.get("redirect");

        if (redirectParam && redirectParam.startsWith("/")) {
          router.push(redirectParam);
        } else if (res.user?.roleCode === "SUPERADMIN" || res.user?.roleName?.toLowerCase().includes("super")) {
          router.push("/internals");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError(res.error || "Email institusi atau kata sandi tidak cocok.");
        setIsLoading(false);
      }
    } catch {
      setError("Gagal menghubungi server autentikasi. Silakan periksa koneksi Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#071613] text-[#F7F5EF] flex flex-col lg:grid lg:grid-cols-12 selection:bg-[#1D6B5A] selection:text-white">
      
      {/* ── LEFT SHOWCASE (Col 7): Enterprise Governance, Sentinel Cockpit & Social Proof ── */}
      <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#05110E] via-[#0A221C] to-[#040D0A]">
        {/* Subtle Ambient Radial Glowing Telemetry & Topographic Grid */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1D6B5A]/25 blur-[120px] pointer-events-none" 
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#B8962E]/15 blur-[140px] pointer-events-none" 
        />
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#2A9478 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px"
          }} 
        />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D6B5A] to-[#0E3B31] border border-white/20 flex items-center justify-center font-bold text-base text-[#D4AF5A] shadow-md">
              N
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-white block leading-tight">
                NAWASANGA
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF5A] font-semibold block leading-none">
                Fleet &amp; Carbon Governance
              </span>
            </div>
          </div>

          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[11px] font-mono py-1 px-3">
            <ShieldCheck size={13} className="mr-1.5 text-emerald-400" /> ISO 27001 &amp; POJK 51 COMPLIANT
          </Badge>
        </div>

        {/* Center Institutional Narrative */}
        <div className="relative z-10 max-w-xl space-y-6 my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SENTINEL ZERO-TRUST GATEWAY
          </div>

          <h1 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Tata Kelola Bahan Bakar Armada &amp; Emisi Scope 1{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF5A] via-[#E6C675] to-[#B8962E]">
              Kelas Korporasi Institusional
            </span>
          </h1>

          <p className="text-sm xl:text-base text-neutral-300 leading-relaxed font-light">
            Platform tersentralisasi holding konglomerasi untuk mengeliminasi manipulasi nota BBM via Sentinel AI Vision, mengamankan efisiensi operasional lintas armada, dan menghasilkan dossier audit emisi tanpa defisit.
          </p>

          {/* Live Security & Telemetry Sentinel Cockpit Card */}
          <div className="rounded-2xl border border-white/15 bg-neutral-900/80 backdrop-blur-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Security Sentinel Status
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                ● Semua Node Nominal (100% Uptime)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 block font-mono">ENKRIPSI DATA</span>
                <span className="font-bold text-white block">256-Bit SHA-256 &amp; JOSE</span>
                <span className="text-[10px] text-emerald-400">Multi-Tenant Isolated</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 block font-mono">STANDAR KALKULASI</span>
                <span className="font-bold text-[#D4AF5A] block">IPCC 2006 Tier-2 AR6</span>
                <span className="text-[10px] text-neutral-300">Mandatori B35/B40 Ready</span>
              </div>
            </div>
          </div>

          {/* 3 Quantitative Proof Points */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <div className="font-serif text-2xl font-bold text-white">Rp 840 Jt+</div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Rata-rata penghematan kebocoran BBM per tahun</p>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-emerald-400">100%</div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Kepatuhan audit POJK 51 Sucofindo / SGS</p>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#D4AF5A]">1.2 Detik</div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Kecepatan Sentinel AI memindai struk kasir</p>
            </div>
          </div>
        </div>

        {/* Left Bottom Legal Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400 border-t border-white/10 pt-4 font-mono">
          <span>NAWASANGA ASSURANCE SYSTEM v2.4</span>
          <span>ENTERPRISE GOVERNANCE EDITION</span>
        </div>
      </div>

      {/* ── RIGHT PORTAL (Col 5): Ultra-Refined Institutional Login Card ── */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-14 xl:p-16 bg-[#FDFCF9] text-[#1A1A18] relative">
        
        {/* Mobile Header Branding (Visible on mobile/tablet) */}
        <div className="flex lg:hidden items-center justify-between pb-6 border-b border-[#EDEAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D6B5A] text-[#D4AF5A] flex items-center justify-center font-bold text-sm">
              N
            </div>
            <span className="font-serif text-lg font-bold text-[#1D6B5A]">
              NAWASANGA
            </span>
          </div>
          <Badge variant="outline" className="border-[#1D6B5A]/30 text-[#1D6B5A] text-[10px]">
            Portal Resmi
          </Badge>
        </div>

        {/* Main Sign-In Card Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D6B5A]/10 text-[#1D6B5A] text-xs font-semibold">
              <Building2 size={13} className="text-[#1D6B5A]" />
              <span>Portal Masuk Institusional</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A18] tracking-tight">
              Autentikasi Kredensial
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7A72] leading-relaxed">
              Masukkan email korporat dan kata sandi terdaftar Anda untuk mengakses portal manajemen armada dan emisi.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Autentikasi Gagal</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form Inputs (No Mock Accounts) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="login-email" 
                className="text-xs font-semibold text-gray-800 flex items-center justify-between"
              >
                <span>Email Korporat / Institusi</span>
                <span className="text-[10px] text-gray-500 font-normal">cth: nama@perusahaan.co.id</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail size={16} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.co.id"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#DEDAD0] bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D6B5A] focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="login-password" 
                  className="text-xs font-semibold text-gray-800"
                >
                  Kata Sandi Akun
                </label>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Untuk alasan keamanan korporat, pemulihan kata sandi dilakukan melalui Administrator IT atau Helpdesk Nawasanga.");
                  }}
                  className="text-xs text-[#1D6B5A] hover:underline font-semibold"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={16} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-10 pr-11 rounded-xl border border-[#DEDAD0] bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D6B5A] focus:border-transparent transition-all font-mono shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1D6B5A] focus:ring-[#1D6B5A] border-gray-300 cursor-pointer accent-[#1D6B5A]"
                />
                <span className="text-xs text-gray-700 font-medium">
                  Ingat sesi di perangkat terpercaya ini
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#1D6B5A] hover:bg-[#155245] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Portal Institusi</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Institutional Registration Referral */}
          <div className="pt-4 border-t border-[#EDEAE0] text-center space-y-2">
            <p className="text-xs text-gray-600">
              Organisasi atau holding Anda belum terdaftar di platform?
            </p>
            <Link
              href="/kyc"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D6B5A] hover:text-[#155245] hover:underline"
            >
              <span>Ajukan Verifikasi &amp; Pendaftaran KYC Korporat</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Footer Security & Compliance Assurance */}
        <div className="pt-6 border-t border-[#EDEAE0] text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium">
            <ShieldCheck size={14} className="text-[#1D6B5A]" />
            <span>Enkripsi 256-Bit TLS/SSL Aktif • Standar Keamanan ISO/IEC 27001 &amp; POJK 51</span>
          </div>
          <p className="text-[10px] text-gray-400">
            Akses ke sistem ini dipantau oleh Sentinel Audit Log. Segala aktivitas tidak sah akan dicatat.
          </p>
        </div>

      </div>
    </div>
  );
}
