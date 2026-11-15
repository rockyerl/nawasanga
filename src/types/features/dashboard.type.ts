export namespace DashboardTypes {
  export type PlanType = "trial" | "starter" | "pro" | "enterprise";

  export interface StatCard {
    label: string;
    value: string;
    unit?: string;
    trend?: string;
    trendUp?: boolean;
    comparison?: string;
    barColor: string;
    barWidth: string;
  }

  export interface TopEmitter {
    name: string;
    value: number;
    pct: number;
  }

  export interface AssetRow {
    name: string;
    location?: string;
    kategori: string;
    konsumsi: number;
    emisi: number;
    efisiensi?: number;
    trend?: "up" | "down" | "flat";
    status: string;
  }

  export interface InsightBox {
    title: string;
    desc: string;
    variant: "lightbulb" | "alert";
  }

  export interface EmissionsDataPoint {
    day: string;
    value: number;
  }

  export interface KycEntry {
    id: string;
    companyName: string;
    picName: string;
    email: string;
    plan: "freemium" | "starter" | "pro" | "enterprise";
    sector: string;
    assetCount: string;
    submittedAt: string;
    status: "pending" | "approved" | "rejected";
  }

  export interface SubscriptionEntry {
    id: string;
    companyName: string;
    plan: "freemium" | "starter" | "pro" | "enterprise";
    seats: number;
    assets: number;
    status: "active" | "trial" | "expired" | "cancelled";
    renewalDate: string;
    mrr: number | null;
  }
}
