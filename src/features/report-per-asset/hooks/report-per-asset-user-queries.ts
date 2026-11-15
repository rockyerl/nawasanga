import { useQuery } from "@tanstack/react-query";
import ReportPerAssetService from "@/features/report-per-asset/services/report-per-asset.service";
import type { Query } from "@/types/lib/query.type";
import type { PlanType } from "@/types/features/report-per-asset.type";

export const assetKeys = {
  list: (plan: PlanType, params: Query.Params) => ["assets", "list", plan, params] as const,
};

export function useAssets(plan: PlanType, params: Query.Params) {
  return useQuery({
    queryKey: assetKeys.list(plan, params),
    queryFn: () => ReportPerAssetService.getAssets(plan, params),
  });
}
