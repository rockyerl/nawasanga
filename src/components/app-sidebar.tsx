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
      { title: "Aset & Kendaraan", url: "/assets", icon: Truck },
      { title: "Driver / Pengemudi", url: "/drivers", icon: UserCheck },
      { title: "Pool & Lokasi", url: "/locations", icon: MapPin },
      { title: "Pencatatan BBM", url: "/logs", icon: Fuel },
    ],
  },
  {
    title: "Laporan & Audit ESG",
    url: "#",
    icon: BarChart3,
    items: [
      { title: "Ringkasan Emisi", url: "/reports/summary" },
      { title: "Laporan per Aset", url: "/reports/per-asset" },
      { title: "Tren Konsumsi", url: "/reports/trends" },
      { title: "Audit Emisi Scope 1", url: "/reports/audit" },
    ],
  },
  {
    title: "Akun & Layanan",
    url: "#",
    icon: CreditCard,
    items: [
      { title: "Billing & Paket", url: "/billing", icon: Receipt },
      { title: "Tiket Bantuan", url: "/support", icon: Headphones },
    ],
  },
];

const internalNavMain = [
  {
    title: "Super Admin Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Tenant",
    url: "#",
    icon: Building2,
    items: [
      { title: "Daftar Organisasi", url: "/admin/organization", icon: Building2 },
      { title: "Akun PIC Perusahaan", url: "/admin/account", icon: ShieldCheck },
      { title: "Master Paket Langganan", url: "/admin/subscription", icon: CreditCard },
      { title: "Faktur & Billing Global", url: "/admin/billing", icon: Receipt },
    ],
  },
  {
    title: "Master Data & ESG",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Faktor Emisi BBM (IPCC)", url: "/admin/fuel-type", icon: Flame },
      { title: "Kategori Kendaraan", url: "/admin/vehicle-type", icon: Truck },
      { title: "Artikel & Regulasi ESG", url: "/admin/article", icon: Newspaper },
    ],
  },
  {
    title: "Operasional Platform",
    url: "#",
    icon: Activity,
    items: [
      { title: "Helpdesk & Tiket Global", url: "/admin/ticketing", icon: Headphones },
      { title: "Voucher Promo", url: "/admin/promo", icon: Percent },
      { title: "Pemantauan Server & Armada", url: "/admin/monitoring", icon: Activity },
    ],
  },
  {
    title: "Keamanan & RBAC",
    url: "#",
    icon: ShieldCheck,
    items: [
      { title: "User Administrator", url: "/admin/users", icon: Users2 },
      { title: "Role & Matriks RBAC", url: "/admin/role", icon: ShieldCheck },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isInternal = pathname.startsWith("/internals") || pathname.startsWith("/admin");

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
          href={isInternal ? "/dashboard" : "/admin"}
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
