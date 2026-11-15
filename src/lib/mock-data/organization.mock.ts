import { OrganizationTypes } from "@/types/features/organization.type";

export const mockOrganizations: OrganizationTypes.Service.OrganizationData[] = [
    {
        id:                    "org_01",
        name:                  "PT Sinergi Logistik Nusantara",
        industry:              "logistics",
        npwp:                  "01.234.567.8-091.000",
        address:               "Jl. Raya Cakung No. 88, Kawasan Industri Pulogadung",
        city:                  "Jakarta",
        province:              "DKI Jakarta",
        subscriptionPlan:      "pro",
        subscriptionExpiresAt: "2026-12-31T23:59:59Z",
        maxAssets:             500,
        timezone:              "Asia/Jakarta",
        logoUrl:               null,
        isActive:              true,
        createdAt:             "2024-01-10T08:00:00Z",
    },
    {
        id:                    "org_02",
        name:                  "CV Bangun Kokoh Abadi",
        industry:              "construction",
        npwp:                  "02.345.678.9-012.000",
        address:               "Jl. Sudirman No. 12, Blok A",
        city:                  "Surabaya",
        province:              "Jawa Timur",
        subscriptionPlan:      "starter",
        subscriptionExpiresAt: "2026-06-30T23:59:59Z",
        maxAssets:             100,
        timezone:              "Asia/Jakarta",
        logoUrl:               null,
        isActive:              true,
        createdAt:             "2024-03-05T08:00:00Z",
    },
    {
        id:                    "org_03",
        name:                  "PT Sawit Mas Sejahtera",
        industry:              "plantation",
        npwp:                  "03.456.789.0-013.000",
        address:               "Jl. Lintas Sumatera KM 45",
        city:                  "Pekanbaru",
        province:              "Riau",
        subscriptionPlan:      "enterprise",
        subscriptionExpiresAt: "2027-03-31T23:59:59Z",
        maxAssets:             2000,
        timezone:              "Asia/Jakarta",
        logoUrl:               null,
        isActive:              true,
        createdAt:             "2023-11-20T08:00:00Z",
    },
    {
        id:                    "org_04",
        name:                  "PT Tambang Mineral Khatulistiwa",
        industry:              "mining",
        npwp:                  null,
        address:               "Jl. Ahmad Yani No. 5",
        city:                  "Balikpapan",
        province:              "Kalimantan Timur",
        subscriptionPlan:      "pro",
        subscriptionExpiresAt: "2026-09-30T23:59:59Z",
        maxAssets:             800,
        timezone:              "Asia/Makassar",
        logoUrl:               null,
        isActive:              true,
        createdAt:             "2024-02-14T08:00:00Z",
    },
    {
        id:                    "org_05",
        name:                  "PT Graha Karya Indonesia",
        industry:              "corporate",
        npwp:                  "05.678.901.2-015.000",
        address:               "Gedung Menara Graha Lt. 10, Jl. TB Simatupang No. 1",
        city:                  "Jakarta",
        province:              "DKI Jakarta",
        subscriptionPlan:      "free",
        subscriptionExpiresAt: null,
        maxAssets:             10,
        timezone:              "Asia/Jakarta",
        logoUrl:               null,
        isActive:              false,
        createdAt:             "2024-06-01T08:00:00Z",
    },
];

export const INDUSTRY_LABEL: Record<OrganizationTypes.Service.Industry, string> = {
    logistics:    "Logistik",
    construction: "Konstruksi",
    plantation:   "Perkebunan",
    mining:       "Pertambangan",
    corporate:    "Korporat",
};

export const INDUSTRY_COLOR: Record<OrganizationTypes.Service.Industry, { bg: string; text: string }> = {
    logistics:    { bg: "#eef5f3", text: "#1D6B5A" },
    construction: { bg: "#FEF9EE", text: "#B45309" },
    plantation:   { bg: "#F0FDF4", text: "#15803D" },
    mining:       { bg: "#FEF3C7", text: "#92400E" },
    corporate:    { bg: "#F0F9FF", text: "#0369A1" },
};

export const PLAN_LABEL: Record<OrganizationTypes.Service.SubscriptionPlan, string> = {
    free:       "Free",
    starter:    "Starter",
    pro:        "Pro",
    enterprise: "Enterprise",
};

export const PLAN_COLOR: Record<OrganizationTypes.Service.SubscriptionPlan, { bg: string; text: string }> = {
    free:       { bg: "#F3F4F6", text: "#374151" },
    starter:    { bg: "#EFF6FF", text: "#1D4ED8" },
    pro:        { bg: "#F5F3FF", text: "#5B21B6" },
    enterprise: { bg: "#FFF7ED", text: "#C2410C" },
};

export const PLAN_MAX_ASSETS: Record<OrganizationTypes.Service.SubscriptionPlan, number> = {
    free:       10,
    starter:    100,
    pro:        500,
    enterprise: 2000,
};