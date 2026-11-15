import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import accountService from "@/features/account/services/account.service";
import { onQueryError } from "@/lib/utils";
import { AccountTypes } from "@/types/features/account.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import type { Query } from "@/types/lib/query.type";

export const accountKeys = {
    all: (params: Query.Params) => ["account", "list", params] as const,
};

export function useAccounts(params: Query.Params) {
    return useQuery({
        queryKey: accountKeys.all(params),
        queryFn:  () => accountService.getAccounts(params),
    });
}

export function useCreateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AccountTypes.Service.CreateAccountRequest) =>
            accountService.createAccount(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["account"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<AccountTypes.Service.CreateAccountRequest> }) =>
            accountService.updateAccount(id, payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["account"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}

export function useDeleteAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => accountService.deleteAccount(id),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["account"] });
            toast.success(res.message);
        },
        onError: (err) => onQueryError(err),
    });
}