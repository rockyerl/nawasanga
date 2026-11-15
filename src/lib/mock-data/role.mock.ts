import type { RoleData } from "@/types/features/role.type";

export const mockRoles: RoleData[] = [
    { id: "r01", roleName: "Super Admin",  permissions: ["Dashboard", "User", "Role", "Driver", "Lokasi", "Aset", "Log", "Laporan", "Billing"] },
    { id: "r02", roleName: "Admin",        permissions: ["Dashboard", "User", "Role", "Driver", "Lokasi", "Aset"] },
    { id: "r03", roleName: "Operator",     permissions: ["Dashboard", "Driver", "Aset"] },
    { id: "r04", roleName: "Viewer",       permissions: ["Dashboard", "Laporan", "Log"] },
    { id: "r05", roleName: "Auditor",      permissions: ["Dashboard", "Laporan", "Log", "Lokasi"] },
    { id: "r06", roleName: "Finance",      permissions: ["Dashboard", "Laporan", "Billing", "Aset"] },
    { id: "r07", roleName: "HR Manager",   permissions: ["Dashboard", "User", "Driver"] },
    { id: "r08", roleName: "IT Support",   permissions: ["Dashboard", "Log", "Role"] },
    { id: "r09", roleName: "Data Entry",   permissions: ["Dashboard", "Aset", "Driver"] },
    { id: "r10", roleName: "Coordinator",  permissions: ["Dashboard", "Lokasi", "Laporan"] },
];