import { useQuery } from "@tanstack/react-query";
import BillingService from "@/features/billing/services/billing.service";

export const billingKeys = {
    detail: (companyName: string) => ["billing", "detail", companyName] as const,
};

export function useBilling(companyName: string) {
    return useQuery({
        queryKey: billingKeys.detail(companyName),
        queryFn: () => BillingService.getBilling(companyName),
        enabled: !!companyName,
    });
}

export function useBillingList(companyName?: string) {
    return useQuery({
        queryKey: ["billing", "detail", companyName || "default"],
        queryFn: () => BillingService.getBilling(companyName),
    });
}