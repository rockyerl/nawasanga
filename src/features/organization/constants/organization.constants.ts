import type { OrganizationTypes } from "@/types/features/organization.type";

export const INDUSTRY_LABEL: Record<string, string> = {
  logistics: "Logistik",
  construction: "Konstruksi",
  plantation: "Perkebunan",
  mining: "Pertambangan",
  corporate: "Korporat",
  "logistics & supply chain": "Logistik & Rantai Pasok",
};

export const INDUSTRY_COLOR: Record<string, { bg: string; text: string }> = {
  logistics: { bg: "#eef5f3", text: "#1D6B5A" },
  construction: { bg: "#FEF9EE", text: "#B45309" },
  plantation: { bg: "#F0FDF4", text: "#15803D" },
  mining: { bg: "#FEF3C7", text: "#92400E" },
  corporate: { bg: "#F0F9FF", text: "#0369A1" },
  "logistics & supply chain": { bg: "#eef5f3", text: "#1D6B5A" },
};

export const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  trial: "Trial",
  freemium: "Freemium",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const PLAN_COLOR: Record<string, { bg: string; text: string }> = {
  free: { bg: "#F3F4F6", text: "#374151" },
  trial: { bg: "#F3F4F6", text: "#374151" },
  freemium: { bg: "#F3F4F6", text: "#374151" },
  starter: { bg: "#EFF6FF", text: "#1D4ED8" },
  pro: { bg: "#F5F3FF", text: "#5B21B6" },
  enterprise: { bg: "#FFF7ED", text: "#C2410C" },
};

export const PLAN_MAX_ASSETS: Record<string, number> = {
  free: 10,
  trial: 10,
  freemium: 10,
  starter: 100,
  pro: 500,
  enterprise: 2000,
};
