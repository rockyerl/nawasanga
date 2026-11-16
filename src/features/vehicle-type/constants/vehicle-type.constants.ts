export const CATEGORY_LABEL: Record<string, string> = {
  motorcycle: "Sepeda Motor",
  car: "Mobil Penumpang / MPV",
  light_truck: "Light Truck (Truk Ringan)",
  medium_truck: "Medium Truck (Truk Sedang)",
  heavy_truck: "Heavy Truck (Truk Berat)",
  bus: "Bus / Angkutan Penumpang",
  heavy_equipment: "Alat Berat (Excavator / Genset)",
  operational: "Kendaraan Operasional",
};

export const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
  motorcycle: { bg: "#F3F4F6", text: "#374151" },
  car: { bg: "#EDE9FE", text: "#6D28D9" },
  light_truck: { bg: "#EFF6FF", text: "#1D4ED8" },
  medium_truck: { bg: "#FFF7ED", text: "#C2410C" },
  heavy_truck: { bg: "#FEF2F2", text: "#991B1B" },
  bus: { bg: "#F0FDF4", text: "#15803D" },
  heavy_equipment: { bg: "#FEF9C3", text: "#854D0E" },
  operational: { bg: "#ECFDF5", text: "#065F46" },
};
