import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Client } from "@/lib/http-client";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const roleKeys = {
    list: (params: Query.Params) => ["roles", "list", params] as const,
};

export function useRoles(params: Query.Params) {
    return useQuery({
        queryKey: roleKeys.list(params),
        queryFn: async () => {
            const queryParams = new URLSearchParams({
                page: String(params.page || 1),
                itemPerPage: String(params.itemPerPage || 10),
                search: params.search || "",
            });
            const res = await Client.get<HttpClientTypes.Response<unknown>, unknown>(
                `internal/roles?${queryParams.toString()}`
            );
            return res.data;
        },
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: unknown) => {
            const res = await Client.post<HttpClientTypes.Response<unknown>, unknown>(
                "internal/roles",
                payload
            );
            return res.data;
        },
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success(res.message || "Role berhasil ditambahkan.");
        },
        onError: (err) => onQueryError(err),
    });
}
