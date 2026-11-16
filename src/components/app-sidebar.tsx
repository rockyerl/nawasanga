"use client";

import {
  BarChart3,
  Building2,
  CreditCard,
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
  ArrowLeftRight,
} from "lucide-react";
import type * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const clientNavMain = [
  {
    title: "Executive Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Armada & Operasional",
    url: "#",
    icon: Truck,
    items: [
      { title: "Aset & Kendaraan", url: "/dashboard/assets", icon: Truck },
      { title: "Driver / Pengemudi", url: "/dashboard/drivers", icon: UserCheck },
      { title: "Pool & Lokasi", url: "/dashboard/locations", icon: MapPin },
      { title: "Pencatatan BBM", url: "/dashboard/logs", icon: Fuel },
    ],
  },
  {
    title: "Laporan & Audit ESG",
    url: "#",
    icon: BarChart3,
    items: [
      { title: "Ringkasan Emisi", url: "/dashboard/reports/summary" },
      { title: "Laporan per Aset", url: "/dashboard/reports/per-asset" },
      { title: "Tren Konsumsi", url: "/dashboard/reports/trends" },
      { title: "Audit Emisi Scope 1", url: "/dashboard/reports/audit" },
    ],
  },
  {
    title: "Akun & Layanan",
    url: "#",
    icon: CreditCard,
    items: [
      { title: "Billing & Paket", url: "/dashboard/billing", icon: Receipt },
      { title: "Tiket Bantuan", url: "/dashboard/support", icon: Headphones },
    ],
  },
];

const internalNavMain = [
  {
    title: "Super Admin Dashboard",
    url: "/internals",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Tenant",
    url: "#",
    icon: Building2,
    items: [
      { title: "Daftar Organisasi", url: "/internals/organization", icon: Building2 },
      { title: "Akun PIC Perusahaan", url: "/internals/account", icon: ShieldCheck },
      { title: "Master Paket Langganan", url: "/internals/subscription", icon: CreditCard },
      { title: "Faktur & Billing Global", url: "/internals/billing", icon: Receipt },
    ],
  },
  {
    title: "Master Data & ESG",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Faktor Emisi BBM (IPCC)", url: "/internals/fuel-type", icon: Flame },
      { title: "Kategori Kendaraan", url: "/internals/vehicle-type", icon: Truck },
      { title: "Artikel & Regulasi ESG", url: "/internals/article", icon: Newspaper },
    ],
  },
  {
    title: "Operasional Platform",
    url: "#",
    icon: Activity,
    items: [
      { title: "Helpdesk & Tiket Global", url: "/internals/ticketing", icon: Headphones },
      { title: "Voucher Promo", url: "/internals/promo", icon: Percent },
      { title: "Pemantauan Server & Armada", url: "/internals/monitoring", icon: Activity },
    ],
  },
  {
    title: "Keamanan & RBAC",
    url: "#",
    icon: ShieldCheck,
    items: [
      { title: "User Administrator", url: "/internals/users", icon: Users2 },
      { title: "Role & Matriks RBAC", url: "/internals/role", icon: ShieldCheck },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isInternal = pathname.startsWith("/internals");

  const teams = isInternal
    ? [
        {
          name: "Sundawa Carbon Internal",
          logo: "/images/nawasanga.png",
          plan: "Super Admin Backoffice",
        },
      ]
    : [
        {
          name: "PT Nusantara Logistik Makmur",
          logo: "/images/nawasanga.png",
          plan: "Client Portal (Pro Tier)",
        },
      ];

  const currentNav = isInternal ? internalNavMain : clientNavMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={currentNav} />
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-[#DEDAD0]/40">
        <Link
          href={isInternal ? "/dashboard" : "/internals"}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#7A7A72] hover:text-[#1D6B5A] hover:bg-[#1D6B5A]/10 transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {isInternal ? "Buka Client Portal View" : "Buka Super Admin Backoffice"}
          </span>
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
