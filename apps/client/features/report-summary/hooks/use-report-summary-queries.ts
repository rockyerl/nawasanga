import { useQuery } from "@tanstack/react-query";
import MockReportService from "@/features/report-summary/services/report-summary.service.mock";
import type { Query } from "@/types/lib/query.type";
import type { PlanType } from "@/lib/mock-data/report-summary.mock";

export const reportKeys = {
    list: (plan: PlanType, params: Query.Params) => ["reports", "list", plan, params] as const,
};

export function useReports(plan: PlanType, params: Query.Params) {
    return useQuery({
        queryKey: reportKeys.list(plan, params),
        queryFn: () => MockReportService.getReports(plan, params),
    });
}