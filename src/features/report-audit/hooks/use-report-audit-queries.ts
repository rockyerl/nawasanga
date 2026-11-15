import { useQuery } from "@tanstack/react-query";
import MockAuditService from "@/features/report-audit/services/report-audit.service.mock";
import type { PlanType } from "@/types/features/report-audit.type";

export const auditKeys = {
    list: (plan: PlanType) => ["audit", "list", plan] as const,
};

export function useAuditInsights(plan: PlanType) {
    return useQuery({
        queryKey: auditKeys.list(plan),
        queryFn: () => MockAuditService.getInsights(plan),
    });
}