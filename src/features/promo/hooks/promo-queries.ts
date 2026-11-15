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
            // Tampilkan toast sukses menggunakan data dari server mock
            toast.success(res.message || "Notifikasi berhasil dikirim ke semua user!");

            // Refresh data tabel jika ada perubahan status 'isPushNotified'
            queryClient.invalidateQueries({ queryKey: ["promo"] });
        },
        onError: (err: any) => {
            // Menangani error dari API atau Service
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
        mutationFn: (id: string) => {
            // Simulasi delete, jika service belum ada bisa tambahkan di mock-service
            console.log("Deleting promo:", id);
            return Promise.resolve({ message: "Promo berhasil dihapus" });
        },
        onSuccess: (res: any) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ["promo"] });
        },
    });
}