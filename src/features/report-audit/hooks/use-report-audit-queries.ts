import { useQuery } from "@tanstack/react-query";
import ReportAuditService from "@/features/report-audit/services/report-audit.service";
import type { PlanType } from "@/types/features/report-audit.type";

export const auditKeys = {
  insights: (plan: PlanType) => ["audit", "insights", plan] as const,
};

export function useAuditInsights(plan: PlanType) {
  return useQuery({
    queryKey: auditKeys.insights(plan),
    queryFn: () => ReportAuditService.getInsights(plan),
  });
}
