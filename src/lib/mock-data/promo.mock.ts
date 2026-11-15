import { PromoTypes } from "@/types/features/promo.type";

export const mockPromos: PromoTypes.Service.PromoData[] = [
    {
        id: "PRM-001",
        title: "Promo Ramadhan Berkah",
        code: "RAMADHAN2026",
        description: "Diskon pengiriman ke seluruh Indonesia.",
        bannerUrl: "/banners/p1.jpg",
        discountType: "persen",
        discountValue: 15,
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        status: "aktif",
        isPushNotified: true,
    },
    {
        id: "PRM-002",
        title: "Gajian Seru Mei",
        code: "GAJIANMEI",
        description: "Potongan flat Rp 20.000.",
        bannerUrl: "/banners/p2.jpg",
        discountType: "nominal",
        discountValue: 20000,
        startDate: "2026-05-25",
        endDate: "2026-05-31",
        status: "non-aktif",
        isPushNotified: false,
    },
    { id: "PRM-003", title: "Flash Sale 4.4", code: "FS44", description: "Potongan 40%", bannerUrl: "", discountType: "persen", discountValue: 40, startDate: "2026-04-04", endDate: "2026-04-04", status: "berakhir", isPushNotified: true },
    { id: "PRM-004", title: "Diskon Ongkir Jabodetabek", code: "JABOFREE", description: "Gratis ongkir", bannerUrl: "", discountType: "nominal", discountValue: 15000, startDate: "2026-01-01", endDate: "2026-12-31", status: "aktif", isPushNotified: true },
    { id: "PRM-005", title: "Promo Pengguna Baru", code: "NEWUSER", description: "Diskon khusus", bannerUrl: "", discountType: "persen", discountValue: 50, startDate: "2026-01-01", endDate: "2026-12-31", status: "aktif", isPushNotified: false },
    { id: "PRM-006", title: "Mantap Weekend", code: "WEEKEND", description: "Promo akhir pekan", bannerUrl: "", discountType: "nominal", discountValue: 10000, startDate: "2026-04-01", endDate: "2026-06-30", status: "aktif", isPushNotified: true },
    { id: "PRM-007", title: "Promo Mudik Nyaman", code: "MUDIK2026", description: "Diskon mudik", bannerUrl: "", discountType: "persen", discountValue: 10, startDate: "2026-03-20", endDate: "2026-04-15", status: "berakhir", isPushNotified: true },
    { id: "PRM-008", title: "Hari Kartini Spesial", code: "KARTINI", description: "Promo wanita", bannerUrl: "", discountType: "persen", discountValue: 21, startDate: "2026-04-21", endDate: "2026-04-21", status: "berakhir", isPushNotified: false },
    { id: "PRM-009", title: "Mei Meriah", code: "MEIMERIAH", description: "Diskon Mei", bannerUrl: "", discountType: "nominal", discountValue: 5000, startDate: "2026-05-01", endDate: "2026-05-31", status: "non-aktif", isPushNotified: false },
    { id: "PRM-010", title: "Promo HUT Perusahaan", code: "HUT10", description: "HUT 10 tahun", bannerUrl: "", discountType: "persen", discountValue: 10, startDate: "2026-06-01", endDate: "2026-06-30", status: "non-aktif", isPushNotified: true },
];

export const STATUS_COLOR: Record<PromoTypes.Service.PromoStatus, { bg: string; text: string }> = {
    aktif: { bg: "#ECFDF5", text: "#047857" },
    "non-aktif": { bg: "#F3F4F6", text: "#374151" },
    berakhir: { bg: "#FEF2F2", text: "#991B1B" },
};