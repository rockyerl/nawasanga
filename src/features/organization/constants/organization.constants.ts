import type { OrganizationTypes } from "@/types/features/organization.type";

export const INDUSTRY_LABEL: Record<OrganizationTypes.Service.Industry, string> = {
  logistics: "Logistik",
  construction: "Konstruksi",
  plantation: "Perkebunan",
  mining: "Pertambangan",
  corporate: "Korporat",
};

export const INDUSTRY_COLOR: Record<OrganizationTypes.Service.Industry, { bg: string; text: string }> = {
  logistics: { bg: "#eef5f3", text: "#1D6B5A" },
  construction: { bg: "#FEF9EE", text: "#B45309" },
  plantation: { bg: "#F0FDF4", text: "#15803D" },
  mining: { bg: "#FEF3C7", text: "#92400E" },
  corporate: { bg: "#F0F9FF", text: "#0369A1" },
};

export const PLAN_LABEL: Record<OrganizationTypes.Service.SubscriptionPlan, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const PLAN_COLOR: Record<OrganizationTypes.Service.SubscriptionPlan, { bg: string; text: string }> = {
  free: { bg: "#F3F4F6", text: "#374151" },
  starter: { bg: "#EFF6FF", text: "#1D4ED8" },
  pro: { bg: "#F5F3FF", text: "#5B21B6" },
  enterprise: { bg: "#FFF7ED", text: "#C2410C" },
};

export const PLAN_MAX_ASSETS: Record<OrganizationTypes.Service.SubscriptionPlan, number> = {
  free: 10,
  starter: 100,
  pro: 500,
  enterprise: 2000,
};
