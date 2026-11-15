import { useQuery } from "@tanstack/react-query";
import MockAssetService from "@/features/report-per-asset/services/report-per-asset.service.mock";
import type { Query } from "@/types/lib/query.type";
import type { PlanType } from "@/lib/mock-data/report-per-asset.mock";

export const assetKeys = {
    list: (plan: PlanType, params: Query.Params) => ["assets", "list", plan, params] as const,
};

export function useAssets(plan: PlanType, params: Query.Params) {
    return useQuery({
        queryKey: assetKeys.list(plan, params),
        queryFn: () => MockAssetService.getAssets(plan, params),
    });
}