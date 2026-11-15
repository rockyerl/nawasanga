import { createApiError, isApiError } from "@/lib/exception";
import { mockPromos } from "@/lib/mock-data/promo.mock";
import { errServiceHandler } from "@/lib/utils";
import { PromoTypes } from "@/types/features/promo.type";
import type { HttpClientTypes } from "@/types/lib/http-client.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Menggunakan let agar data bisa dimanipulasi (simulasi delete/update)
let promosData: PromoTypes.Service.PromoData[] = [...mockPromos];

class MockPromoService {
    /**
     * Mengambil daftar promo dengan simulasi filter dan pagination
     */
    async getPromos({
                        page = 1,
                        itemPerPage = 10,
                        search = "",
                        sortBy = "startDate",
                        direction = QueryDirection.DESC,
                    }: Query.Params): Promise<HttpClientTypes.Response<any>> {
        try {
            await delay(500); // Simulasi latency network

            // 1. Filtering
            let filtered = promosData.filter(
                (p) =>
                    p.title.toLowerCase().includes(search.toLowerCase()) ||
                    p.code.toLowerCase().includes(search.toLowerCase())
            );

            // 2. Sorting
            filtered.sort((a, b) => {
                const aVal = String(a[sortBy as keyof typeof a] ?? "");
                const bVal = String(b[sortBy as keyof typeof b] ?? "");

                return direction === QueryDirection.DESC
                    ? bVal.localeCompare(aVal)
                    : aVal.localeCompare(bVal);
            });

            // 3. Pagination
            const start = (page - 1) * itemPerPage;
            const paginatedItems = filtered.slice(start, start + itemPerPage);

            return {
                code: 200,
                status: "OK",
                message: "Berhasil mengambil data promo",
                data: {
                    items: paginatedItems,
                    count: filtered.length,
                    page,
                    itemPerPage,
                    totalPages: Math.ceil(filtered.length / itemPerPage),
                },
            };
        } catch (err) {
            throw errServiceHandler(err as Error);
        }
    }

    /**
     * Simulasi pengiriman push notification
     */
    async pushNotification(id: string): Promise<HttpClientTypes.Response<any>> {
        try {
            await delay(800); // Simulasi proses blast notifikasi

            const index = promosData.findIndex((p) => p.id === id);
            if (index === -1) {
                throw createApiError(404, "Not Found", "Data promo tidak ditemukan");
            }

            // Update status lokal untuk mensimulasikan perubahan data
            promosData[index] = {
                ...promosData[index],
                isPushNotified: true
            };

            return {
                code: 200,
                status: "OK",
                message: `Notifikasi untuk promo "${promosData[index].title}" telah berhasil diblast ke semua perangkat customer.`,
                data: promosData[index]
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }

    /**
     * Simulasi hapus promo
     */
    async deletePromo(id: string): Promise<HttpClientTypes.Response<any>> {
        try {
            await delay(300);
            const index = promosData.findIndex((p) => p.id === id);

            if (index === -1) {
                throw createApiError(404, "Not Found", "Promo tidak ditemukan");
            }

            promosData.splice(index, 1);

            return {
                code: 200,
                status: "OK",
                message: "Promo berhasil dihapus secara permanen"
            };
        } catch (err) {
            if (isApiError(err)) throw err;
            throw errServiceHandler(err as Error);
        }
    }
}

// Inisialisasi sebagai singleton
const promoService = new MockPromoService();
export default promoService;