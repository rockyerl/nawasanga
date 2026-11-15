import type { PlanType } from "@/types/features/report-tren.type";

export type { PlanType };

export declare namespace BillingTypes {
    namespace Service {
        interface PlanFeature {
            label: string;
            available: boolean;
            locked?: boolean;
        }

        interface PlanOption {
            id: PlanType;
            name: string;
            price: string;
            priceNote?: string;
            description: string;
            features: PlanFeature[];
            color: string;
            lightBg: string;
            border: string;
            badge: string;
            recommended?: boolean;
        }

        interface BillingInfo {
            currentPlan: PlanType;
            companyName: string;
            expiresAt: string; // ISO date string
            startedAt: string;
            nextBillingDate?: string;
            assetUsed: number;
            assetLimit: number;
            invoices: Invoice[];
        }

        interface Invoice {
            id: string;
            date: string;
            amount: string;
            status: "paid" | "pending" | "failed";
            downloadUrl?: string;
        }

        type BillingResponse = {
            code: number;
            status: string;
            message: string;
            data: BillingInfo;
        };
    }
}