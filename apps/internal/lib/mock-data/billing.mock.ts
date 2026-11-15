import { BillingTypes } from "@/types/features/billing.type";

export const mockBillings: BillingTypes.Service.BillingData[] = [
    { id: "bil_01", organizationName: "PT Sinergi Logistik Nusantara",   personInCharge: "Ahmad Fauzi",     paymentDate: "2026-04-01T10:00:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2027-04-01T23:59:59Z", amount: 7990000,  status: "success" },
    { id: "bil_02", organizationName: "CV Bangun Kokoh Abadi",           personInCharge: "Siti Rahayu",     paymentDate: "2026-03-05T14:20:00Z", subscriptionPlan: "starter",    subscriptionExpiresAt: "2026-09-05T23:59:59Z", amount: 2990000,  status: "success" },
    { id: "bil_03", organizationName: "PT Sawit Mas Sejahtera",          personInCharge: "Budi Santoso",    paymentDate: "2026-04-10T09:30:00Z", subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-04-10T23:59:59Z", amount: 19990000, status: "success" },
    { id: "bil_04", organizationName: "PT Tambang Mineral Khatulistiwa", personInCharge: "Dewi Kusuma",     paymentDate: "2026-04-15T11:00:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2027-04-15T23:59:59Z", amount: 7990000,  status: "success" },
    { id: "bil_05", organizationName: "CV Maju Sejahtera Trans",         personInCharge: "Nurul Hidayah",   paymentDate: "2026-04-18T08:45:00Z", subscriptionPlan: "starter",    subscriptionExpiresAt: "2027-04-18T23:59:59Z", amount: 2990000,  status: "success" },
    { id: "bil_06", organizationName: "PT Ekspres Nusantara Cargo",      personInCharge: "Hendra Wijaya",   paymentDate: "2026-03-20T13:00:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2026-09-20T23:59:59Z", amount: 799000,   status: "success" },
    { id: "bil_07", organizationName: "PT Hijau Energi Terbarukan",      personInCharge: "Eka Putri",       paymentDate: "2026-04-22T10:15:00Z", subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-04-22T23:59:59Z", amount: 19990000, status: "success" },
    { id: "bil_08", organizationName: "CV Dharma Bakti Konstruksi",      personInCharge: "Fajar Nugroho",   paymentDate: "2026-04-05T09:00:00Z", subscriptionPlan: "starter",    subscriptionExpiresAt: "2026-10-05T23:59:59Z", amount: 799000,   status: "pending" },
    { id: "bil_09", organizationName: "PT Indo Pacific Shipping",        personInCharge: "Gita Larasati",   paymentDate: "2026-04-25T14:30:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2027-04-25T23:59:59Z", amount: 7990000,  status: "success" },
    { id: "bil_10", organizationName: "PT Karya Agung Perkebunan",       personInCharge: "Imam Santoso",    paymentDate: "2026-03-28T08:00:00Z", subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-03-28T23:59:59Z", amount: 19990000, status: "success" },
    { id: "bil_11", organizationName: "PT Mega Bumi Konstruksi",         personInCharge: "Krisna Adi",      paymentDate: "2026-04-01T11:30:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2027-04-01T23:59:59Z", amount: 7990000,  status: "success" },
    { id: "bil_12", organizationName: "PT Nusa Indah Transportasi",      personInCharge: "Laila Fitriani",  paymentDate: "2026-04-08T10:00:00Z", subscriptionPlan: "starter",    subscriptionExpiresAt: "2026-10-08T23:59:59Z", amount: 2990000,  status: "success" },
    { id: "bil_13", organizationName: "PT Omega Tambang Raya",           personInCharge: "Muhamad Rizal",   paymentDate: "2026-04-12T09:15:00Z", subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-04-12T23:59:59Z", amount: 19990000, status: "success" },
    { id: "bil_14", organizationName: "PT Quantum Energi Indonesia",     personInCharge: "Oscar Permana",   paymentDate: "2026-04-20T13:45:00Z", subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-04-20T23:59:59Z", amount: 19990000, status: "success" },
    { id: "bil_15", organizationName: "PT Rimba Sejati Plantation",      personInCharge: "Putri Anggraini", paymentDate: "2026-03-15T08:30:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2026-09-15T23:59:59Z", amount: 799000,   status: "failed"  },
    { id: "bil_16", organizationName: "PT Titan Baja Konstruksi",        personInCharge: "Reno Saputra",    paymentDate: "2026-04-28T10:00:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2027-04-28T23:59:59Z", amount: 7990000,  status: "success" },
    { id: "bil_17", organizationName: "PT Usaha Mina Bahari",            personInCharge: "Sari Dewi",       paymentDate: "2026-04-02T11:00:00Z", subscriptionPlan: "starter",    subscriptionExpiresAt: "2026-10-02T23:59:59Z", amount: 2990000,  status: "success" },
    { id: "bil_18", organizationName: "PT Visi Global Trans",            personInCharge: "Teguh Wibowo",    paymentDate: "2026-04-17T09:30:00Z", subscriptionPlan: "enterprise", subscriptionExpiresAt: "2027-04-17T23:59:59Z", amount: 19990000, status: "success" },
    { id: "bil_19", organizationName: "CV Wahana Mitra Distribusi",      personInCharge: "Umi Kalsum",      paymentDate: "2026-04-14T14:00:00Z", subscriptionPlan: "starter",    subscriptionExpiresAt: "2026-10-14T23:59:59Z", amount: 799000,   status: "pending" },
    { id: "bil_20", organizationName: "PT Xenon Industri Nusantara",     personInCharge: "Vino Oktavian",   paymentDate: "2026-04-26T08:00:00Z", subscriptionPlan: "pro",        subscriptionExpiresAt: "2027-04-26T23:59:59Z", amount: 7990000,  status: "success" },
];

export const PLAN_LABEL: Record<BillingTypes.Service.SubscriptionPlan, string> = {
    free:       "Free",
    starter:    "Starter",
    pro:        "Pro",
    enterprise: "Enterprise",
};

export const PLAN_COLOR: Record<BillingTypes.Service.SubscriptionPlan, { bg: string; text: string }> = {
    free:       { bg: "#F3F4F6", text: "#374151" },
    starter:    { bg: "#EFF6FF", text: "#1D4ED8" },
    pro:        { bg: "#F5F3FF", text: "#5B21B6" },
    enterprise: { bg: "#FFF7ED", text: "#C2410C" },
};