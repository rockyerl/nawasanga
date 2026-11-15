import { TicketingTypes } from "@/types/features/ticketing.type";

export const mockTickets: TicketingTypes.Service.TicketData[] = [
    {
        id: "TICK-001",
        organizationName: "PT Sinergi Logistik Nusantara",
        customerName: "Andi Hermawan",
        reportType: "Bug Sistem",
        reportDetail: "Gagal melakukan cetak resi pada pesanan nomor #12345.",
        attachmentUrl: "resi-error.png",
        status: "baru",
        createdAt: "2026-04-30T10:00:00Z",
    },
    {
        id: "TICK-002",
        organizationName: "CV Bangun Kokoh Abadi",
        customerName: "Siti Aminah",
        reportType: "Pertanyaan Layanan",
        reportDetail: "Mohon info mengenai biaya pengiriman ke wilayah Timur.",
        status: "on progress",
        createdAt: "2026-04-29T14:20:00Z",
    },
    {
        id: "TICK-003",
        organizationName: "PT Global Trans Port",
        customerName: "Budi Santoso",
        reportType: "Kendala Login",
        reportDetail: "Akun admin tidak bisa login setelah reset password.",
        status: "selesai",
        createdAt: "2026-04-28T09:15:00Z",
    },
    {
        id: "TICK-004",
        organizationName: "PT Maju Mundur Sejahtera",
        customerName: "Dewi Lestari",
        reportType: "Bug Sistem",
        reportDetail: "Data invoice tidak muncul di dashboard utama.",
        attachmentUrl: "blank-dashboard.jpg",
        status: "baru",
        createdAt: "2026-04-27T11:30:00Z",
    },
    {
        id: "TICK-005",
        organizationName: "PT Fast Delivery Indonesia",
        customerName: "Eko Prasetyo",
        reportType: "Request Fitur",
        reportDetail: "Meminta penambahan fitur ekspor laporan ke format PDF.",
        status: "on progress",
        createdAt: "2026-04-26T16:45:00Z",
    },
    {
        id: "TICK-006",
        organizationName: "CV Berkah Jaya",
        customerName: "Fitriani",
        reportType: "Pertanyaan Layanan",
        reportDetail: "Cara integrasi API untuk pelacakan paket.",
        status: "selesai",
        createdAt: "2026-04-25T08:00:00Z",
    },
    {
        id: "TICK-007",
        organizationName: "PT Selalu Ada Solusi",
        customerName: "Gading Marten",
        reportType: "Bug Sistem",
        reportDetail: "Aplikasi mobile sering force close saat buka menu profile.",
        status: "baru",
        createdAt: "2026-04-24T13:10:00Z",
    },
    {
        id: "TICK-008",
        organizationName: "PT Digital Nusantara",
        customerName: "Hendra Kurnia",
        reportType: "Billing",
        reportDetail: "Tagihan bulan Maret belum terupdate statusnya.",
        attachmentUrl: "bukti-bayar.pdf",
        status: "on progress",
        createdAt: "2026-04-23T10:20:00Z",
    },
    {
        id: "TICK-009",
        organizationName: "CV Utama Cargo",
        customerName: "Indah Permata",
        reportType: "Pertanyaan Layanan",
        reportDetail: "Apakah ada diskon untuk pengiriman di atas 1 ton?",
        status: "selesai",
        createdAt: "2026-04-22T15:00:00Z",
    },
    {
        id: "TICK-010",
        organizationName: "PT Teknologi Anak Bangsa",
        customerName: "Joko Widodo",
        reportType: "Bug Sistem",
        reportDetail: "Notifikasi email tidak masuk ke inbox customer.",
        status: "baru",
        createdAt: "2026-04-21T09:00:00Z",
    }
];

export const STATUS_LABEL: Record<TicketingTypes.Service.TicketStatus, string> = {
    baru: "Baru",
    "on progress": "On Progress",
    selesai: "Selesai",
};

export const STATUS_COLOR: Record<TicketingTypes.Service.TicketStatus, { bg: string; text: string }> = {
    baru: { bg: "#EFF6FF", text: "#1D4ED8" },
    "on progress": { bg: "#FFF7ED", text: "#C2410C" },
    selesai: { bg: "#ECFDF5", text: "#047857" },
};