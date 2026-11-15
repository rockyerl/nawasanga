export namespace BillingTypes {
    export namespace Service {
        export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

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