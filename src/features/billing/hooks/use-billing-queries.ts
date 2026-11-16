import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import BillingService, { type GlobalBillingParams } from "@/features/billing/services/billing.service";
import { onQueryError } from "@/lib/utils";
import type { HttpClientTypes } from "@/types/lib/http-client.type";

export const billingKeys = {
    global: (params: GlobalBillingParams) => ["billing", "global", params] as const,
    detail: (companyName?: string) => ["billing", "detail", companyName || "default"] as const,
    invoice: (id: string) => ["billing", "invoice", id] as const,
};

export function useGlobalBilling(params: GlobalBillingParams = {}) {
    return useQuery({
        queryKey: billingKeys.global(params),
        queryFn: () => BillingService.getGlobalBilling(params),
    });
}

export function useBilling(companyName: string) {
    return useQuery({
        queryKey: billingKeys.detail(companyName),
        queryFn: () => BillingService.getBilling(companyName),
        enabled: !!companyName,
    });
}

export function useBillingList(companyName?: string) {
    return useQuery({
        queryKey: billingKeys.detail(companyName),
        queryFn: () => BillingService.getBilling(companyName),
    });
}

export function useCreateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            organizationId: string;
            amountIdr: number;
            paymentMethod: string;
            status?: string;
        }) => BillingService.createInvoice(payload),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["billing"] });
            toast.success(res.message || "Faktur berhasil diterbitkan.");
        },
        onError: (err) => onQueryError(err),
    });
}

export function useUpdateInvoiceStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, paymentMethod }: { id: string; status: string; paymentMethod?: string }) =>
            BillingService.updateInvoiceStatus(id, status, paymentMethod),
        onSuccess: async (res: HttpClientTypes.Response<unknown>) => {
            await queryClient.invalidateQueries({ queryKey: ["billing"] });
            toast.success(res.message || "Status faktur berhasil diperbarui.");
        },
        onError: (err) => onQueryError(err),
    });
}
