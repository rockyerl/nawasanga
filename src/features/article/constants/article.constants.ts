export const STATUS_LABEL: Record<string, string> = {
  draft: "Draf",
  published: "Diterbitkan",
  archived: "Diarsipkan",
};

export const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#FEF3C7", text: "#B45309" },
  published: { bg: "#eef5f3", text: "#1D6B5A" },
  archived: { bg: "#F3F4F6", text: "#6B7280" },
};
