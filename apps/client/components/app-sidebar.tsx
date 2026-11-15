"use client";

import {
    BarChart3,
    CreditCard,
    FileText,
    IdCard,
    LayoutDashboard,
    MapPin,
    Package,
    Settings,
    Shield,
    User,
    Users,
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
        name: "Jonathan",
        email: "jonathan@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Fuel Carbon Tracker",
            logo: "/images/nawasanga.png",
            plan: "Super Admin",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Pengguna",
            url: "#",
            icon: Users,
            items: [
                { title: "User", url: "/internals/users" },
                { title: "Role", url: "/internals/role" },
                { title: "Driver", url: "/internals/driver"},
            ],
        },
        {
            title: "Manajemen Aset",
            url: "#",
            icon: Settings,
            items: [
                { title: "Lokasi", url: "/internals/location"},
                { title: "Aset", url: "/internals/operational"},
            ],
        },
        {
            title: "Log",
            url: "/internals/log",
            icon: FileText,
        },
        {
            title: "Laporan",
            url: "#",
            icon: BarChart3,
            items: [
                { title: "Ringkasan", url: "/internals/report-summary" },
                { title: "Per-Asset", url: "/internals/report-per-asset" },
                { title: "Tren", url: "/internals/report-tren"},
                { title: "Audit", url: "/internals/report-audit"},
            ],
        },
        {
            title: "Billing",
            url: "/internals/billing",
            icon: CreditCard,
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