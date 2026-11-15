"use client";

import {
    BarChart3,
    Building2,
    CreditCard,
    Database,
    Flame,
    Headphones,
    LayoutDashboard,
    Newspaper,
    Settings2,
    ShieldCheck,
    Users2,
    TicketIcon,
    Percent,
    UserCog,
    CarFront,
    ReceiptText,
    Briefcase
} from "lucide-react";
import type * as React from "react";

import {NavMain} from "@/components/nav-main";
import {NavUser} from "@/components/nav-user";
import {TeamSwitcher} from "@/components/team-switcher";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "Jonathan",
        email: "jonathan@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Nawasanga",
            logo: "/images/nawasanga-logo.png",
            plan: "Super Admin",
        },
    ],
    navMain: [
        {
            title: "Beranda",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Manajemen Perusahaan",
            url: "#",
            icon: Building2,
            items: [
                {
                    title: "Organisasi",
                    url: "/internals/organization",
                    icon: Briefcase,
                },
                {
                    title: "Akun",
                    url: "/internals/account",
                    icon: ShieldCheck,
                },
            ],
        },
        {
            title: "Manajemen Pengguna",
            url: "#",
            icon: Users2,
            items: [
                {
                    title: "Role",
                    url: "/internals/role",
                    icon: UserCog,
                },
                {
                    title: "User",
                    url: "/internals/users",
                    icon: Users2,
                },
            ],
        },
        {
            title: "Pemantauan Data",
            url: "/internals/monitoring",
            icon: BarChart3,
        },
        {
            title: "Langganan & Tagihan",
            url: "#",
            icon: CreditCard,
            items: [
                {
                    title: "Langganan",
                    url: "/internals/subscription",
                    icon: CreditCard,
                },
                {
                    title: "Tagihan",
                    url: "/internals/billing",
                    icon: ReceiptText,
                },
            ],
        },
        {
            title: "Manajemen Promo",
            url: "/internals/promo",
            icon: Percent,
        },
        {
            title: "Dukungan Pelanggan",
            url: "/internals/ticketing",
            icon: Headphones,
        },
        {
            title: "Manajemen Artikel",
            url: "/internals/article",
            icon: Newspaper,
        },
        {
            title: "Konfigurasi Sistem",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Tipe Bahan Bakar",
                    url: "/internals/fuel-type",
                    icon: Flame,
                },
                {
                    title: "Tipe Kendaraan",
                    url: "/internals/vehicle-type",
                    icon: CarFront,
                },
            ],
        },
    ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
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