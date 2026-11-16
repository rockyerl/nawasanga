"use client";
import { useState, useEffect } from "react";

function NawasangaLogo({ size = 32 }: { size?: number }) {
  const r = size / 2;
  const cx = r, cy = r;
  const nodeR = size * 0.095;
  const outerR = r * 0.78;
  const dirs = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={r - 1} stroke="#1D6B5A" strokeWidth="0.8" opacity="0.3" />
      {/* Radial lines */}
      {dirs.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const nx = cx + Math.cos(rad) * outerR;
        const ny = cy + Math.sin(rad) * outerR;
        return (
          <line key={deg} x1={cx} y1={cy} x2={nx} y2={ny}
            stroke="#1D6B5A" strokeWidth="0.6" opacity="0.5" />
        );
      })}
      {/* Outer nodes — teal */}
      {dirs.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const nx = cx + Math.cos(rad) * outerR;
        const ny = cy + Math.sin(rad) * outerR;
        return <circle key={`n${deg}`} cx={nx} cy={ny} r={nodeR} fill="#2A9478" />;
      })}
      {/* Center node — gold */}
      <circle cx={cx} cy={cy} r={nodeR * 1.3} fill="#B8962E" />
    </svg>
  );
}

const navItems = [
  { label: "Studi Kasus", href: "#case-studies" },
  { label: "Fitur Enterprise", href: "#fitur" },
  { label: "Kalkulator ROI", href: "#kalkulator" },
  { label: "Paket & Harga", href: "#pricing" },
  { label: "Regulasi", href: "#regulasi" },
  { label: "Knowledge Base", href: "#artikel" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#1D6B5A]/15 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <NawasangaLogo size={34} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-lg tracking-tight text-[#1A1A18]">
              Nawasanga
            </span>
            <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-[#1D6B5A] font-bold leading-none mt-0.5">
              Enterprise ESG Platform
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold text-[#7A7A72] hover:text-[#1D6B5A] transition-colors duration-150 font-ui tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-xs text-[#7A7A72] hover:text-[#1A1A18] font-bold px-3 py-2 transition-colors duration-200 font-ui"
          >
            Login Portal
          </a>
          <a
            href="#pricing"
            className="text-xs bg-[#1D6B5A] hover:bg-[#175749] text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-200 font-ui shadow-sm hover:shadow"
          >
            Mulai Uji Coba Gratis
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#7A7A72] hover:text-[#1A1A18] p-1.5"
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#F7F5EF]/98 backdrop-blur-md border-t border-[#1D6B5A]/15 px-6 py-5 flex flex-col gap-3 shadow-lg">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-[#7A7A72] hover:text-[#1D6B5A] py-1 font-ui"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#EDEAE0] flex flex-col gap-2">
            <a 
              href="/login" 
              onClick={() => setMenuOpen(false)}
              className="text-xs border border-[#1D6B5A]/30 text-[#1D6B5A] font-bold px-4 py-2.5 rounded-xl text-center font-ui"
            >
              Login Portal
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMenuOpen(false)}
              className="text-xs bg-[#1D6B5A] text-white font-bold px-4 py-2.5 rounded-xl text-center font-ui shadow-sm"
            >
              Mulai Uji Coba Gratis
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
