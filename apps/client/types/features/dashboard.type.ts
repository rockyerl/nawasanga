import { HttpClientTypes } from "@/types/lib/http-client.type";

export namespace DashboardTypes {
    export type PlanType = "trial" | "starter" | "pro" | "enterprise";

    export interface StatCard {
        label: string;
        value: string;
        unit?: string;
        trend: string;
        trendUp: boolean;
        comparison: string;
        barColor: string;
        barWidth: string;
    }

    export interface EmissionsDataPoint {
        day: string;
        value: number;
        // Pro: per-category breakdown
        genset?: number;
        alatBerat?: number;
        // Enterprise: per-location breakdown
        surabaya?: number;
        bali?: number;
        balikpapan?: number;
    }

    export interface TopEmitter {
        name: string;
        value: string;
        unit: string;
        pct: number;
    }

    export interface AssetRow {
        name: string;
        location?: string; // Enterprise only
        kategori: string;
        konsumsi: number;
        emisi: number;
        efisiensi?: number;
        trend?: "up" | "down" | "flat"; // Pro+
        status: "Aktif" | "Non-Aktif";
    }

    export interface InsightBox {
        type: "info" | "warning" | "success";
        title: string;
        body: string;
        linkLabel?: string;
    }

    export interface LocationBar {
        city: string;
        value: number;
    }

    export interface PerformanceCategory {
        name: string;
        pct: number;
        color: string;
    }

    export namespace Service {
        // Trial
        export interface TrialDashboardData {
            plan: "trial";
            daysLeft: number;
            statCards: StatCard[];
            emissionsChart: EmissionsDataPoint[];
            topEmitters: TopEmitter[];
            assets: AssetRow[];
        }

        // Starter
        export interface StarterDashboardData {
            plan: "starter";
            statCards: StatCard[];
            emissionsChart: EmissionsDataPoint[];
            topEmitters: TopEmitter[];
            assetUsage: { used: number; total: number };
            assets: AssetRow[];
        }

        // Pro
        export interface ProDashboardData {
            plan: "pro";
            statCards: StatCard[];
            emissionsChart: EmissionsDataPoint[];
            topEmitters: TopEmitter[];
            insights: InsightBox[];
            assets: AssetRow[];
        }

        // Enterprise
        export interface EnterpriseDashboardData {
            plan: "enterprise";
            statCards: StatCard[];
            emissionsChart: EmissionsDataPoint[];
            locationBars: LocationBar[];
            performanceCategories: PerformanceCategory[];
            insights: InsightBox[];
            assets: AssetRow[];
        }

        export type DashboardData =
            | TrialDashboardData
            | StarterDashboardData
            | ProDashboardData
            | EnterpriseDashboardData;

        export type DashboardResponse = HttpClientTypes.Response<DashboardData>;
    }
}