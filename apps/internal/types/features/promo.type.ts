export namespace PromoTypes {
    export namespace Service {
        export type PromoStatus = "aktif" | "non-aktif" | "berakhir";

        export interface PromoData {
            id: string;
            title: string;
            code: string;
            description: string;
            bannerUrl: string;
            discountType: "persen" | "nominal";
            discountValue: number;
            startDate: string;
            endDate: string;
            status: PromoStatus;
            isPushNotified: boolean;
        }
    }
}