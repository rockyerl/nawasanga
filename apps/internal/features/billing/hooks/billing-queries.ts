import { useQuery } from "@tanstack/react-query";
import billingService from "@/features/billing/services/billing.service.mock";
import { Query } from "@/types/lib/query.type";

export const billingKeys = {
    all: (params: Query.Params) => ["billing", "list", params] as const,
};

export function useBillings(params: Query.Params) {
    return useQuery({
        queryKey: billingKeys.all(params),
        queryFn: () => billingService.getBillings(params),
    });
}