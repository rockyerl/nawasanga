export namespace SubscriptionTypes {
    export namespace Service {
        export type PlanKey = "free" | "starter" | "pro" | "enterprise";

        export interface PlanFeature {
            key:     string;
            label:   string;
            enabled: boolean;
        }

        export interface PlanData {
            id:             string;
            key:            PlanKey;
            name:           string;
            description:    string;
            maxAssets:      number;
            maxUsers:       number;
            priceMonthly:   number;
            priceYearly:    number;
            features:       PlanFeature[];
            isActive:       boolean;
            updatedAt:      string;
        }

        export interface UpdatePlanRequest {
            name:           string;
            description:    string;
            maxAssets:      number;
            maxUsers:       number;
            priceMonthly:   number;
            priceYearly:    number;
            features:       PlanFeature[];
            isActive:       boolean;
        }
    }
}