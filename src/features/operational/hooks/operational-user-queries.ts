import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import operationalService from "@/features/operational/services/operational.service";
import { onQueryError } from "@/lib/utils";
import { OperationalTypes } from "@/types/features/operational.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const operationalKeys = {
    assets: (params: Query.Params) => ["operational", "assets", params] as const,
};

export function useAssets(params: Query.Params) {
    return useQuery({
        queryKey: operationalKeys.assets(params),
        queryFn:  () => operationalService.getAssets(params),
    });
}

export function useCreateAsset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Omit<OperationalTypes.Service.AssetData, "id">) =>
            operationalService.createAsset(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["operational", "assets"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteAsset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => operationalService.deleteAsset(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["operational", "assets"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}