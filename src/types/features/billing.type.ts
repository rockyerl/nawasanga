import type { PlanType } from "@/types/features/report-tren.type";

export type { PlanType };

export namespace BillingTypes {
  export namespace Service {
    export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

    export interface PlanFeature {
      label: string;
      available: boolean;
      locked?: boolean;
    }

    export interface PlanOption {
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

    export interface Invoice {
      id: string;
      date: string;
      amount: string;
      status: "paid" | "pending" | "failed";
      downloadUrl?: string;
    }

    export interface BillingInfo {
      currentPlan: PlanType;
      companyName: string;
      expiresAt: string; // ISO date string
      startedAt: string;
      nextBillingDate?: string;
      assetUsed: number;
      assetLimit: number;
      invoices: Invoice[];
    }

    export type BillingResponse = {
      code: number;
      status: string;
      message: string;
      data: BillingInfo;
    };

    export interface BillingData {
      id: string;
      organizationName: string;
      personInCharge: string;
      paymentDate: string;
      subscriptionPlan: SubscriptionPlan;
      subscriptionExpiresAt: string;
      amount: number;
      status: "success" | "pending" | "failed";
    }
  }
}
