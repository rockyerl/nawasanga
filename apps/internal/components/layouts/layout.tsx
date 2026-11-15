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
import { ChevronDown, ChevronRight, Home, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


const SEGMENT_LABELS: Record<string, string> = {
    dashboard:    "Beranda",
    internals:    "Internals",
    organization: "Organisasi",
    account:      "Akun",
    role:         "Role",
    users:        "User",
    monitoring:   "Pemantauan Data",
    subscription: "Langganan",
    billing:      "Tagihan",
    promo:        "Manajemen Promo",
    ticketing:    "Dukungan Pelanggan",
    article:      "Manajemen Artikel",
    "fuel-type":  "Tipe Bahan Bakar",
    "vehicle-type": "Tipe Kendaraan",
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
    const router = useRouter();

    const handleLogout = () => {
        router.push("/");
    };
    const pathname = usePathname();
    const breadcrumbs = buildBreadcrumbs(pathname);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0 overflow-x-hidden">

                {/* ── HEADER ── */}
                <header
                    className="flex h-[60px] shrink-0 items-center gap-4 px-5"
                    style={{
                        borderBottom: "1px solid #DEDAD0",
                        backgroundColor: "#F7F5EF",
                    }}
                >
                    {/* Breadcrumb */}
                    <nav className="flex flex-1 items-center gap-1 text-sm min-w-0">
                        <a
                            href="/dashboard"
                            className="flex items-center shrink-0 transition-colors duration-150 hover:text-[#1D6B5A]"
                            style={{ color: "#7A7A72" }}
                        >
                            <Home className="h-4 w-4" />
                        </a>

                        {breadcrumbs.map((crumb, i) => {
                            const isLast = i === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={crumb.href}>
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "#DEDAD0" }} />
                                    {isLast ? (
                                        <span className="font-semibold truncate" style={{ color: "#1A1A18" }}>
                                            {crumb.name}
                                        </span>
                                    ) : (
                                        <a
                                            href={crumb.href}
                                            className="truncate transition-colors duration-150 hover:text-[#1D6B5A]"
                                            style={{ color: "#7A7A72" }}
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
                            <div
                                className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-[#EDEAE0] outline-none"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/shadcn.jpg" alt="Jonathan" />
                                    <AvatarFallback
                                        className="text-xs font-semibold"
                                        style={{
                                            background: "linear-gradient(135deg, #1D6B5A, #2A9478)",
                                            color: "#F7F5EF",
                                        }}
                                    >
                                        JN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm leading-none mb-0.5" style={{ fontWeight: 600, color: "#1A1A18" }}>
                                        Jonathan
                                    </span>
                                    <span className="text-xs leading-none" style={{ color: "#B8962E", fontWeight: 500 }}>
                                        Super Admin
                                    </span>
                                </div>
                                <ChevronDown className="h-4 w-4" style={{ color: "#7A7A72" }} />
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-44"
                            style={{ borderColor: "#DEDAD0", backgroundColor: "#F7F5EF" }}
                        >
                            <DropdownMenuItem
                                className="cursor-pointer font-medium focus:bg-[#fdf2f0]"
                                style={{ color: "#C14B2A" }}
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Content */}
                <div className="min-w-0 max-w-full overflow-x-hidden" style={{ backgroundColor: "#F7F5EF" }}>
                    {children}
                </div>

            </SidebarInset>
        </SidebarProvider>
    );
}