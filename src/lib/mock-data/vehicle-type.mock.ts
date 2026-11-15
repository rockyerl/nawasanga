import { VehicleTypeTypes } from "@/types/features/vehicle-type.type";

export const mockVehicleTypes: VehicleTypeTypes.Service.VehicleTypeData[] = [
    {
        id: "vt_01",
        category: "motorcycle",
        name: "Sepeda Motor",
        defaultFuelTypeId: "ft_pertalite",
        consumptionKm: 0.0590,
        gvwMinTon: null,
        description: "Kendaraan roda dua, termasuk skuter dan motor bebek.",
    },
    {
        id: "vt_02",
        category: "car",
        name: "Mobil Penumpang",
        defaultFuelTypeId: "ft_pertamax",
        consumptionKm: 0.1710,
        gvwMinTon: null,
        description: "Kendaraan penumpang roda empat, termasuk sedan, SUV, dan MPV.",
    },
    {
        id: "vt_03",
        category: "light_truck",
        name: "Truk Ringan ≤ 3.5 ton",
        defaultFuelTypeId: "ft_solar",
        consumptionKm: 0.2450,
        gvwMinTon: null,
        description: "Pick-up, minibus niaga, dan kendaraan pengiriman ringan.",
    },
    {
        id: "vt_04",
        category: "heavy_truck",
        name: "Truk Berat > 7.5 ton",
        defaultFuelTypeId: "ft_solar",
        consumptionKm: 0.5500,
        gvwMinTon: 7.50,
        description: "Truk gandeng, trailer, dan angkutan barang berat.",
    },
    {
        id: "vt_05",
        category: "bus",
        name: "Bus",
        defaultFuelTypeId: "ft_solar",
        consumptionKm: 0.4200,
        gvwMinTon: 5.00,
        description: "Bus antar kota, bus pariwisata, dan bus TransJakarta.",
    },
    {
        id: "vt_06",
        category: "heavy_equipment",
        name: "Alat Berat",
        defaultFuelTypeId: "ft_solar",
        consumptionKm: 0.8800,
        gvwMinTon: 10.00,
        description: "Excavator, bulldozer, wheel loader, dan crane bergerak.",
    },
];

export const CATEGORY_LABEL: Record<VehicleTypeTypes.Service.Category, string> = {
    motorcycle:      "Sepeda Motor",
    car:             "Mobil",
    light_truck:     "Truk Ringan",
    heavy_truck:     "Truk Berat",
    bus:             "Bus",
    heavy_equipment: "Alat Berat",
};

export const CATEGORY_COLOR: Record<VehicleTypeTypes.Service.Category, { bg: string; text: string }> = {
    motorcycle:      { bg: "#eef5f3", text: "#1D6B5A"  },
    car:             { bg: "#F0F9FF", text: "#0369A1"  },
    light_truck:     { bg: "#FEF9EE", text: "#B45309"  },
    heavy_truck:     { bg: "#FEF3C7", text: "#92400E"  },
    bus:             { bg: "#F5F3FF", text: "#5B21B6"  },
    heavy_equipment: { bg: "#FFF1F2", text: "#BE123C"  },
};

// Mock fuel types for the dropdown
export const mockFuelTypes = [
    { id: "ft_pertalite", name: "Pertalite" },
    { id: "ft_pertamax",  name: "Pertamax" },
    { id: "ft_solar",     name: "Solar"    },
    { id: "ft_lpg",       name: "LPG"      },
    { id: "ft_listrik",   name: "Listrik"  },
];