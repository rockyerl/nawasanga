import { MonitoringTypes } from "@/types/features/monitoring.type";

export const mockMonitorings: MonitoringTypes.Service.MonitoringData[] = [
    {
        id: "mon_01",
        organizationName: "PT Sinergi Logistik Nusantara",
        totalAssets: 1500000000,
        lastLogin: "2026-04-30T08:30:00Z",
        totalEmissionLogs: 1250,
        totalUsers: 45,
        lastDataSync: "2026-04-30T00:00:00Z",
    },
    {
        id: "mon_02",
        organizationName: "CV Bangun Kokoh Abadi",
        totalAssets: 450000000,
        lastLogin: "2026-04-29T15:45:00Z",
        totalEmissionLogs: 840,
        totalUsers: 12,
        lastDataSync: "2026-04-28T12:00:00Z",
    }
];