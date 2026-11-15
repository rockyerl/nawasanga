import { DashboardTypes } from "@/types/features/dashboard.type";

export const mockStatCards: DashboardTypes.StatCard[] = [
    { label: "Total Tenant Aktif",   value: "248",     trend: "+21",   trendUp: true,  comparison: "vs bulan lalu",  barColor: "#1D6B5A", barWidth: "72%" },
    { label: "KYC Pending Review",   value: "31",      trend: "+7",    trendUp: false, comparison: "masuk hari ini", barColor: "#C14B2A", barWidth: "45%" },
    { label: "MRR (juta Rp)",        value: "162,4",   trend: "+18,3", trendUp: true,  comparison: "vs bulan lalu",  barColor: "#B8962E", barWidth: "68%" },
    { label: "Total Aset Terpantau", value: "21.840",  trend: "+412",  trendUp: true,  comparison: "vs minggu lalu", barColor: "#2A9478", barWidth: "84%" },
    { label: "Total Log Emisi",      value: "187.560", trend: "+3.2k", trendUp: true,  comparison: "vs kemarin",     barColor: "#1D6B5A", barWidth: "91%" },
];

export const mockEmissionsData: DashboardTypes.EmissionsDataPoint[] = [
    { day: "Sel, 21 Apr", value: 12 },
    { day: "Rab, 22 Apr", value: 17 },
    { day: "Kam, 23 Apr", value: 22 },
    { day: "Jum, 24 Apr", value: 19 },
    { day: "Sab, 25 Apr", value: 11 },
    { day: "Min, 26 Apr", value: 8  },
    { day: "Sen, 27 Apr", value: 24 },
    { day: "Sel, 28 Apr", value: 28 },
    { day: "Rab, 29 Apr", value: 31 },
    { day: "Kam, 30 Apr", value: 26 },
    { day: "Jum, 01 Mei", value: 20 },
    { day: "Sab, 02 Mei", value: 14 },
    { day: "Min, 03 Mei", value: 9  },
    { day: "Sen, 04 Mei", value: 33 },
];

export const mockKycEntries: DashboardTypes.KycEntry[] = [
    { id: "KYC-001", companyName: "PT Maju Bersama Logistik",    picName: "Budi Santoso",    email: "budi@majulogistik.co.id",      plan: "pro",        sector: "Fleet & Logistik", assetCount: "51–200 unit",  submittedAt: "30 Apr 2026, 08.14", status: "pending"  },
    { id: "KYC-002", companyName: "CV Hijau Konstruksi",         picName: "Sari Dewi",       email: "sari@hijaukonstruksi.com",     plan: "starter",    sector: "Konstruksi",       assetCount: "6–20 unit",    submittedAt: "30 Apr 2026, 07.52", status: "pending"  },
    { id: "KYC-003", companyName: "PT Sawit Nusantara Tbk",      picName: "Ahmad Fauzi",     email: "ahmad@sawitnusantara.id",      plan: "enterprise", sector: "Perkebunan",       assetCount: "200+ unit",    submittedAt: "29 Apr 2026, 16.30", status: "pending"  },
    { id: "KYC-004", companyName: "UD Karya Tambang Raya",       picName: "Dewi Rahayu",     email: "dewi@karyatambang.com",        plan: "pro",        sector: "Pertambangan",     assetCount: "21–50 unit",   submittedAt: "29 Apr 2026, 14.05", status: "approved" },
    { id: "KYC-005", companyName: "PT Ekspres Cargo Indo",       picName: "Rizky Pratama",   email: "rizky@eksprescargo.id",        plan: "starter",    sector: "Fleet & Logistik", assetCount: "6–20 unit",    submittedAt: "28 Apr 2026, 10.20", status: "rejected" },
    { id: "KYC-006", companyName: "PT Rimba Hijau Perkebunan",   picName: "Nurul Hidayah",   email: "nurul@rimbahijau.id",          plan: "enterprise", sector: "Perkebunan",       assetCount: "200+ unit",    submittedAt: "28 Apr 2026, 09.00", status: "pending"  },
    { id: "KYC-007", companyName: "CV Inti Bangun Sejahtera",    picName: "Fajar Nugroho",   email: "fajar@intibanguns.com",        plan: "starter",    sector: "Konstruksi",       assetCount: "6–20 unit",    submittedAt: "27 Apr 2026, 15.40", status: "approved" },
    { id: "KYC-008", companyName: "PT Bumi Nusantara Mining",    picName: "Gita Larasati",   email: "gita@buminusantara.id",        plan: "pro",        sector: "Pertambangan",     assetCount: "51–200 unit",  submittedAt: "27 Apr 2026, 13.15", status: "pending"  },
    { id: "KYC-009", companyName: "PT Surya Abadi Transport",    picName: "Hendra Wijaya",   email: "hendra@suryaabadi.co.id",      plan: "pro",        sector: "Fleet & Logistik", assetCount: "21–50 unit",   submittedAt: "26 Apr 2026, 11.00", status: "approved" },
    { id: "KYC-010", companyName: "CV Delta Prima Cargo",        picName: "Ika Sari",        email: "ika@deltaprimacargo.com",      plan: "freemium",   sector: "Fleet & Logistik", assetCount: "1–5 unit",     submittedAt: "26 Apr 2026, 08.30", status: "rejected" },
    { id: "KYC-011", companyName: "PT Kencana Hijau Plantation", picName: "Joko Prasetyo",   email: "joko@kencanahijau.id",         plan: "enterprise", sector: "Perkebunan",       assetCount: "200+ unit",    submittedAt: "25 Apr 2026, 16.00", status: "pending"  },
    { id: "KYC-012", companyName: "PT Langit Biru Energi",       picName: "Kartika Putri",   email: "kartika@langitbiru.co.id",     plan: "pro",        sector: "Energi",           assetCount: "51–200 unit",  submittedAt: "25 Apr 2026, 10.45", status: "approved" },
];

export const mockSubscriptions: DashboardTypes.SubscriptionEntry[] = [
    { id: "SUB-001", companyName: "PT Sawit Nusantara Tbk",         plan: "enterprise", seats: 120, assets: 340, status: "active",    renewalDate: "1 Jun 2026",   mrr: null    },
    { id: "SUB-002", companyName: "PT Karya Tambang Raya",          plan: "pro",        seats: 62,  assets: 78,  status: "active",    renewalDate: "15 Mei 2026",  mrr: 799000  },
    { id: "SUB-003", companyName: "PT Maju Bersama Logistik",       plan: "pro",        seats: 45,  assets: 55,  status: "trial",     renewalDate: "5 Mei 2026",   mrr: 799000  },
    { id: "SUB-004", companyName: "CV Hijau Konstruksi",            plan: "starter",    seats: 12,  assets: 14,  status: "active",    renewalDate: "1 Jun 2026",   mrr: 299000  },
    { id: "SUB-005", companyName: "UD Berkah Perkebunan",           plan: "starter",    seats: 8,   assets: 9,   status: "expired",   renewalDate: "20 Apr 2026",  mrr: 299000  },
    { id: "SUB-006", companyName: "PT Indo Freight Lines",          plan: "freemium",   seats: 3,   assets: 2,   status: "active",    renewalDate: "—",            mrr: 0       },
    { id: "SUB-007", companyName: "PT Rimba Hijau Perkebunan",      plan: "enterprise", seats: 98,  assets: 412, status: "active",    renewalDate: "10 Jul 2026",  mrr: null    },
    { id: "SUB-008", companyName: "PT Surya Abadi Transport",       plan: "pro",        seats: 38,  assets: 47,  status: "active",    renewalDate: "25 Mei 2026",  mrr: 799000  },
    { id: "SUB-009", companyName: "PT Bumi Nusantara Mining",       plan: "pro",        seats: 55,  assets: 88,  status: "trial",     renewalDate: "8 Mei 2026",   mrr: 799000  },
    { id: "SUB-010", companyName: "CV Inti Bangun Sejahtera",       plan: "starter",    seats: 10,  assets: 11,  status: "active",    renewalDate: "15 Jun 2026",  mrr: 299000  },
    { id: "SUB-011", companyName: "PT Langit Biru Energi",          plan: "pro",        seats: 42,  assets: 63,  status: "active",    renewalDate: "30 Mei 2026",  mrr: 799000  },
    { id: "SUB-012", companyName: "PT Kencana Hijau Plantation",    plan: "enterprise", seats: 150, assets: 520, status: "active",    renewalDate: "1 Agu 2026",   mrr: null    },
    { id: "SUB-013", companyName: "CV Delta Prima Cargo",           plan: "freemium",   seats: 2,   assets: 3,   status: "active",    renewalDate: "—",            mrr: 0       },
    { id: "SUB-014", companyName: "PT Nusantara Energi Listrik",    plan: "pro",        seats: 29,  assets: 34,  status: "cancelled", renewalDate: "—",            mrr: 0       },
    { id: "SUB-015", companyName: "PT Mega Trans Internasional",    plan: "enterprise", seats: 200, assets: 670, status: "active",    renewalDate: "15 Sep 2026",  mrr: null    },
];