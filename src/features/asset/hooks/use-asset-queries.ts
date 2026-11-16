import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AssetService from "@/features/asset/services/asset.service";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const assetKeys = {
    list: (params: Query.Params) => ["assets-list", params] as const,
};

export function useAssets(params: Query.Params) {
    return useQuery({
        queryKey: assetKeys.list(params),
        queryFn: () => AssetService.getAssets(params),
    });
}

export function useCreateAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: unknown) => AssetService.createAsset(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: ["assets-list"],
            });
            toast.success(res.message || "Aset berhasil ditambahkan");
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
            AssetService.updateAsset(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: ["assets-list"],
            });
            toast.success(res.message || "Aset berhasil diperbarui");
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => AssetService.deleteAsset(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({
                queryKey: ["assets-list"],
            });
            toast.success(res.message || "Aset berhasil dihapus");
        },
        onError: (err) => onQueryError(err),
    });
}
