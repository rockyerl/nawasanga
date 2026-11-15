import { useQuery } from "@tanstack/react-query";
import MockBillingService from "@/features/billing/services/billing.service.mock";

export const billingKeys = {
    detail: (companyName: string) => ["billing", "detail", companyName] as const,
};

export function useBilling(companyName: string) {
    return useQuery({
        queryKey: billingKeys.detail(companyName),
        queryFn: () => MockBillingService.getBilling(companyName),
        enabled: !!companyName,
    });
}