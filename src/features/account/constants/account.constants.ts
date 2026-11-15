import type { AccountTypes } from "@/types/features/account.type";

export const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const PLAN_COLOR: Record<string, { bg: string; text: string }> = {
  free: { bg: "#F3F4F6", text: "#374151" },
  starter: { bg: "#EFF6FF", text: "#1D4ED8" },
  pro: { bg: "#F5F3FF", text: "#5B21B6" },
  enterprise: { bg: "#FFF7ED", text: "#C2410C" },
};

export const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
  suspended: "Ditangguhkan",
};

export const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  active: { bg: "#ECFDF5", text: "#065F46" },
  inactive: { bg: "#F3F4F6", text: "#374151" },
  suspended: { bg: "#FEF2F2", text: "#991B1B" },
};
