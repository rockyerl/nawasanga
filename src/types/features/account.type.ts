export namespace AccountTypes {
    export namespace Service {
        export type AccountStatus = "active" | "inactive" | "suspended";

        export interface AccountData {
            id:               string;
            organizationId?:  string;
            companyName:      string;
            picName:          string;
            position:         string;
            email:            string;
            subscriptionPlan: "free" | "starter" | "pro" | "enterprise";
            lastActivityAt:   string | null;
            status:           AccountStatus;
            createdAt:        string;
        }

        export interface CreateAccountRequest {
            organizationId:   string;
            companyName?:     string;
            picName:          string;
            position:         string;
            email:            string;
            password?:        string;
            subscriptionPlan?: "free" | "starter" | "pro" | "enterprise";
            lastActivityAt?:  string | null;
            status?:          AccountStatus;
        }
    }
}
