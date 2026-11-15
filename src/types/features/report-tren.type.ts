import type { HttpClientTypes } from "@/types/lib/http-client.type";

export type PlanType = "trial" | "starter" | "pro" | "enterprise";

export declare namespace TrendTypes {
    namespace Service {
        interface TrendPoint {
            date: string;
            value: number;
        }

        interface TrendSeries {
            label: string;
            color: string;
            data: TrendPoint[];
        }

        interface PeriodComparison {
            label: string;
            current: number;
            previous: number;
            unit: string;
            changePercent: number;
            changeUp: boolean;
        }

        type InsightType = "anomaly" | "recommendation" | "efficiency";

        interface InsightItem {
            type: InsightType;
            title: string;
            description: string;
            actionLabel?: string;
        }

        interface TrendData {
            emissionSeries: TrendSeries[];
            fuelSeries?: TrendSeries[];
            periodComparison?: PeriodComparison[];
            insights?: InsightItem[];
        }

        type TrendResponse = HttpClientTypes.Response<TrendData>;
    }
}