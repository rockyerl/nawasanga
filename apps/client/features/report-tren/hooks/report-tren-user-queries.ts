import { useQuery } from "@tanstack/react-query";
import MockTrendService from "@/features/report-tren/services/report-tren.service.mock";
import type { PlanType } from "@/types/features/report-tren.type";

export const trendKeys = {
    list: (plan: PlanType) => ["trends", "list", plan] as const,
};

export function useTrends(plan: PlanType) {
    return useQuery({
        queryKey: trendKeys.list(plan),
        queryFn: () => MockTrendService.getTrends(plan),
    });
}