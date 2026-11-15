// lib/mock-data/role.mock.ts
import { RoleTypes } from "@/types/features/role.type";

export const MENU_RESOURCES = [
    { title: "Beranda", url: "/dashboard" },
    { title: "Organisasi", url: "/internals/organization" },
    { title: "Akun", url: "/internals/account" },
    { title: "Tipe Bahan Bakar", url: "/internals/fuel-type" },
    { title: "Tipe Kendaraan", url: "/internals/vehicle-type" },
    { title: "Manajemen Pengguna", url: "/internals/users" },
    { title: "Pemantauan Data", url: "/internals/monitoring" },
    { title: "Langganan & Tagihan", url: "/internals/subscription" },
    { title: "Dukungan Pelanggan", url: "/internals/support" },
    { title: "Manajemen Artikel", url: "/internals/articles" },
];

const allow = (...urls: string[]) =>
    MENU_RESOURCES.map((m) => ({ ...m, enabled: urls.includes(m.url) }));

export const mockRoles: RoleTypes.Service.RoleData[] = [
    {
        id: "role_01",
        name: "Super Admin",
        userCount: 2,
        createdAt: "2024-01-10T08:00:00Z",
        permissions: MENU_RESOURCES.map((m) => ({ ...m, enabled: true })),
    },
    {
        id: "role_02",
        name: "Admin Operasional",
        userCount: 5,
        createdAt: "2024-03-05T08:00:00Z",
        permissions: allow(
            "/dashboard",
            "/internals/monitoring",
            "/internals/fuel-type",
            "/internals/vehicle-type",
            "/internals/users"
        ),
    },
    {
        id: "role_03",
        name: "Finance",
        userCount: 3,
        createdAt: "2024-04-12T08:00:00Z",
        permissions: allow(
            "/dashboard",
            "/internals/subscription",
            "/internals/organization"
        ),
    },
    {
        id: "role_04",
        name: "Customer Support",
        userCount: 8,
        createdAt: "2024-06-01T08:00:00Z",
        permissions: allow(
            "/dashboard",
            "/internals/support",
            "/internals/account"
        ),
    },
    {
        id: "role_05",
        name: "Editor Konten",
        userCount: 2,
        createdAt: "2024-08-20T08:00:00Z",
        permissions: allow(
            "/dashboard",
            "/internals/articles"
        ),
    },
    {
        id: "role_06",
        name: "Viewer",
        userCount: 1,
        createdAt: "2024-09-15T08:00:00Z",
        permissions: allow("/dashboard"),
    },
];