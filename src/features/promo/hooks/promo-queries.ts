import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Query } from "@/types/lib/query.type";
import { toast } from "sonner";
import promoService from "@/features/promo/services/promo.service";


export const promoKeys = {
    all: (params: Query.Params) => ["promo", "list", params] as const,
    detail: (id: string) => ["promo", "detail", id] as const,
};

export function usePromos(params: Query.Params) {
    return useQuery({
        queryKey: promoKeys.all(params),
        queryFn: () => promoService.getPromos(params),
        placeholderData: (previousData) => previousData,
    });
}


export function usePushPromo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => promoService.pushNotification(id),
        onSuccess: (res: any) => {
            toast.success(res.message || "Notifikasi berhasil dikirim ke semua user!");
            queryClient.invalidateQueries({ queryKey: ["promo"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal mengirim push notification");
        },
    });
}

/**
 * Hook untuk menghapus promo (Delete)
 */
export function useDeletePromo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => promoService.deletePromo(id),
        onSuccess: (res: any) => {
            toast.success(res.message || "Promo berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["promo"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Gagal menghapus promo");
        },
    });
}