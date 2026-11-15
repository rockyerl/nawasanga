export const STATUS_LABEL: Record<string, string> = {
  open: "Terbuka",
  in_progress: "Sedang Diproses",
  resolved: "Selesai",
  closed: "Ditutup",
};

export const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  open: { bg: "#FEF3C7", text: "#B45309" },
  in_progress: { bg: "#DBEAFE", text: "#1D4ED8" },
  resolved: { bg: "#eef5f3", text: "#1D6B5A" },
  closed: { bg: "#F3F4F6", text: "#6B7280" },
};
