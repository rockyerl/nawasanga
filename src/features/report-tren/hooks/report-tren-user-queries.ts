import { useQuery } from "@tanstack/react-query";
import ReportTrendService from "@/features/report-tren/services/report-tren.service";
import type { PlanType } from "@/types/features/report-tren.type";

export const trendKeys = {
  detail: (plan: PlanType) => ["trends", "detail", plan] as const,
};

export function useTrends(plan: PlanType) {
  return useQuery({
    queryKey: trendKeys.detail(plan),
    queryFn: () => ReportTrendService.getTrends(plan),
  });
}
