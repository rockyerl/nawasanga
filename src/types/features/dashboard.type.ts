export namespace DashboardTypes {
    export interface StatCard {
        label:      string;
        value:      string;
        trend:      string;
        trendUp:    boolean;
        comparison: string;
        barColor:   string;
        barWidth:   string;
    }

    export interface EmissionsDataPoint {
        day:   string;
        value: number;
    }

    export interface KycEntry {
        id:          string;
        companyName: string;
        picName:     string;
        email:       string;
        plan:        "freemium" | "starter" | "pro" | "enterprise";
        sector:      string;
        assetCount:  string;
        submittedAt: string;
        status:      "pending" | "approved" | "rejected";
    }

    export interface SubscriptionEntry {
        id:          string;
        companyName: string;
        plan:        "freemium" | "starter" | "pro" | "enterprise";
        seats:       number;
        assets:      number;
        status:      "active" | "trial" | "expired" | "cancelled";
        renewalDate: string;
        mrr:         number | null;
    }
}