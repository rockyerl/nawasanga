"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, ChevronRight, Home } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
    dashboard:        "Dashboard",
    internals:        "Internals",
    users:            "User",
    role:             "Role",
    driver:           "Driver",
    location:         "Lokasi",
    operational:      "Aset Kendaraan",
    log:              "Log BBM",
    report:           "Laporan",
    "report-summary": "Ringkasan Emisi",
    "report-per-asset":"Laporan per Aset",
    "report-tren":    "Tren Emisi",
    "report-audit":   "Audit Emisi",
    billing:          "Billing",
    organization:     "Organisasi",
    account:          "Akun",
    subscription:     "Langganan",
    "fuel-type":      "Tipe BBM",
    "vehicle-type":   "Tipe Kendaraan",
    promo:            "Promo",
    ticketing:        "Tiket Bantuan",
    article:          "Artikel",
    monitoring:       "Monitoring",
};

function buildBreadcrumbs(pathname: string) {
    const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
    return segments.map((seg, i) => ({
        name: SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, i + 1).join("/"),
    }));
}

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const breadcrumbs = buildBreadcrumbs(pathname);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0 overflow-x-hidden">

                {/* ── HEADER ── */}
                <header className="flex h-[60px] shrink-0 items-center border-b border-[#DEDAD0] bg-[#F7F5EF] px-5 gap-4">

                    {/* Breadcrumb */}
                    <nav className="flex flex-1 items-center gap-1 text-sm min-w-0">
                        <a
                            href="/dashboard"
                            className="flex items-center shrink-0 text-[#7A7A72] hover:text-[#1D6B5A] transition-colors"
                        >
                            <Home className="h-4 w-4" />
                        </a>

                        {breadcrumbs.map((crumb, i) => {
                            const isLast = i === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={crumb.href}>
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#DEDAD0]" />
                                    {isLast ? (
                                        <span className="font-semibold truncate text-[#1A1A18]">
                                            {crumb.name}
                                        </span>
                                    ) : (
                                        <a
                                            href={crumb.href}
                                            className="truncate text-[#7A7A72] hover:text-[#1D6B5A] transition-colors"
                                        >
                                            {crumb.name}
                                        </a>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>

                    {/* User info — kanan */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none rounded-lg px-2 py-1.5 hover:bg-[#EDEAE0] transition-colors outline-none">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/shadcn.jpg" alt="Jonathan" />
                                    <AvatarFallback className="text-xs font-semibold bg-[#1D6B5A] text-[#F7F5EF]">
                                        JN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-semibold leading-none mb-0.5 text-[#1A1A18]">
                                        Jonathan
                                    </span>
                                    <span className="text-xs leading-none text-[#7A7A72]">
                                        Super Admin
                                    </span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-[#7A7A72]" />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-44 border-[#DEDAD0] bg-[#F7F5EF]"
                        >
                            <DropdownMenuItem
                                className="cursor-pointer font-medium text-[#C14B2A] focus:text-[#C14B2A] focus:bg-[#fdf2f0]"
                                onClick={() => {
                                    // tambahkan logout logic di sini
                                    // contoh: router.push("/auth")
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </header>

                {/* Content area ikut --background */}
                <div className="min-w-0 max-w-full overflow-x-hidden bg-[#F7F5EF]">
                    {children}
                </div>

            </SidebarInset>
        </SidebarProvider>
    );
}