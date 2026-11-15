import type { PromoTypes } from "@/types/features/promo.type";

export const STATUS_COLOR: Record<PromoTypes.Service.PromoStatus, { bg: string; text: string }> = {
  aktif: { bg: "#ECFDF5", text: "#047857" },
  "non-aktif": { bg: "#F3F4F6", text: "#374151" },
  berakhir: { bg: "#FEF2F2", text: "#991B1B" },
};
