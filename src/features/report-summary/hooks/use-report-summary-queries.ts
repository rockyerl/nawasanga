import { useQuery } from "@tanstack/react-query";
import ReportSummaryService from "@/features/report-summary/services/report-summary.service";
import type { Query } from "@/types/lib/query.type";
import type { PlanType } from "@/types/features/report-summary.type";

export const reportKeys = {
  list: (plan: PlanType, params: Query.Params) => ["reports", "list", plan, params] as const,
};

export function useReports(plan: PlanType, params: Query.Params) {
  return useQuery({
    queryKey: reportKeys.list(plan, params),
    queryFn: () => ReportSummaryService.getReports(plan, params),
  });
}
