"use client";

import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Flame,
  Fuel,
  Headphones,
  LayoutDashboard,
  MapPin,
  Newspaper,
  Percent,
  Settings2,
  ShieldCheck,
  Truck,
  UserCheck,
  Users2,
  Car,
  Activity,
  Receipt,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Sundawa Admin",
    email: "superadmin@fuelcarbon.id",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Nawasanga ESG Platform",
      logo: "/images/nawasanga.png",
      plan: "Unified Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Armada & BBM",
      url: "#",
      icon: Truck,
      items: [
        { title: "Aset Kendaraan", url: "/internals/operational", icon: Car },
        { title: "Driver / Pengemudi", url: "/internals/driver", icon: UserCheck },
        { title: "Lokasi & Pool", url: "/internals/location", icon: MapPin },
        { title: "Pencatatan BBM", url: "/internals/log", icon: Fuel },
      ],
    },
    {
      title: "Laporan & Emisi",
      url: "#",
      icon: BarChart3,
      items: [
        { title: "Ringkasan Emisi", url: "/internals/report-summary" },
        { title: "Laporan per Aset", url: "/internals/report-per-asset" },
        { title: "Tren Konsumsi", url: "/internals/report-tren" },
        { title: "Audit Emisi Karbon", url: "/internals/report-audit" },
      ],
    },
    {
      title: "Manajemen Klien",
      url: "#",
      icon: Building2,
      items: [
        { title: "Organisasi", url: "/internals/organization", icon: Building2 },
        { title: "Akun Organisasi", url: "/internals/account", icon: ShieldCheck },
        { title: "Langganan", url: "/internals/subscription", icon: CreditCard },
        { title: "Faktur & Billing", url: "/internals/billing", icon: Receipt },
      ],
    },
    {
      title: "Layanan & Dukungan",
      url: "#",
      icon: Headphones,
      items: [
        { title: "Tiket Bantuan", url: "/internals/ticketing", icon: Headphones },
        { title: "Promo & Kupon", url: "/internals/promo", icon: Percent },
        { title: "Artikel & Regulasi", url: "/internals/article", icon: Newspaper },
        { title: "Pemantauan Sistem", url: "/internals/monitoring", icon: Activity },
      ],
    },
    {
      title: "Konfigurasi Sistem",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Master Jenis BBM", url: "/internals/fuel-type", icon: Flame },
        { title: "Tipe Kendaraan", url: "/internals/vehicle-type", icon: Truck },
        { title: "Pengguna (Users)", url: "/internals/users", icon: Users2 },
        { title: "Role & Izin Akses", url: "/internals/role", icon: ShieldCheck },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
