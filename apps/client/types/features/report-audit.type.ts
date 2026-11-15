import type { HttpClientTypes } from "@/types/lib/http-client.type";

export type PlanType = "trial" | "starter" | "pro" | "enterprise";

export declare namespace AuditTypes {
    namespace Service {
        type InsightType = "anomaly" | "efficiency" | "recommendation";

        interface InsightItem {
            type: InsightType;
            title: string;
            description: string;
            actionLabel?: string;
        }

        interface BenchmarkItem {
            location: string;
            color: string;
            percent: number;
        }

        interface EmissionBreakdown {
            label: string;
            color: string;
            tonCO2e: number;
            percent: number;
        }

        interface Methodology {
            standard: string;
            scope: string;
            emissionFactor: string;
            calculation: string;
        }

        interface AuditReport {
            period: string;
            totalEmission: number;
            breakdown: EmissionBreakdown[];
            methodology: Methodology;
            downloadLabel: string;
        }

        interface AuditData {
            insights: InsightItem[];
            benchmarks?: BenchmarkItem[];
            auditReport?: AuditReport;
        }

        type AuditResponse = HttpClientTypes.Response<AuditData>;
    }
}