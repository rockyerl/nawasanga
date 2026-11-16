export namespace OrganizationTypes {
    export namespace Service {
        export type Industry =
            | "logistics"
            | "construction"
            | "plantation"
            | "mining"
            | "corporate";

        export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

        export interface OrganizationData {
            id:                     string;
            name:                   string;
            slug?:                  string;
            industry:               Industry;
            npwp:                   string | null;
            nib?:                   string | null;
            contactEmail?:          string | null;
            contactPhone?:          string | null;
            address:                string;
            city:                   string;
            province:               string;
            latitude?:              number | null;
            longitude?:             number | null;
            subscriptionPlan:       SubscriptionPlan;
            subscriptionExpiresAt:  string | null;
            maxAssets:              number;
            timezone:               string;
            logoUrl:                string | null;
            isActive:               boolean;
            status?:                string;
            notes?:                 string | null;
            createdAt:              string;
        }
    }
}
