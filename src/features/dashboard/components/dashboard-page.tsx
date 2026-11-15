"use client";

import { useState } from "react";
import ClientDashboard from "./client-dashboard";
import InternalDashboard from "./internal-dashboard";
import { LayoutDashboard, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"client" | "internal">("client");

  return (
    <div className="relative">
      {/* Floating View Switcher at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center bg-[#1A1A18] text-white rounded-full p-1.5 shadow-2xl border border-[#2A9478]/40 backdrop-blur-md">
        <button
          onClick={() => setActiveTab("client")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeTab === "client"
              ? "bg-[#1D6B5A] text-white shadow-sm"
              : "text-[#7A7A72] hover:text-white"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Client Portal View
        </button>
        <button
          onClick={() => setActiveTab("internal")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeTab === "internal"
              ? "bg-[#1D6B5A] text-white shadow-sm"
              : "text-[#7A7A72] hover:text-white"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Internal Superadmin View
        </button>
      </div>

      {activeTab === "client" ? <ClientDashboard /> : <InternalDashboard />}
    </div>
  );
}
