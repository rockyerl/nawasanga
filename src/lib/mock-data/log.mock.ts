export interface LogData {
    id: string;
    date: string; // "DD/MM/YYYY"
    time: string; // "HH:mm"
    driverId: string;
    driverName: string;
    vehicleId: string;
    vehicleName: string;
    assetId: string;
    assetName: string;
    lastOdometer: number;
    pictureUrl?: string;
}

const drivers = [
    { id: "DRV-001", name: "Budi Santoso" },
    { id: "DRV-002", name: "Agus Pratama" },
    { id: "DRV-003", name: "Siti Rahayu" },
    { id: "DRV-004", name: "Dewi Lestari" },
    { id: "DRV-005", name: "Hendra Wijaya" },
    { id: "DRV-006", name: "Rina Marlina" },
];

const vehicles = [
    { id: "VHC-001", name: "Toyota Innova B 1234 ABC" },
    { id: "VHC-002", name: "Mitsubishi Canter D 5678 DEF" },
    { id: "VHC-003", name: "Isuzu Elf F 9012 GHI" },
    { id: "VHC-004", name: "Hino Dutro B 3456 JKL" },
    { id: "VHC-005", name: "Daihatsu Granmax D 7890 MNO" },
];

const assets = [
    { id: "AST-001", name: "Excavator CAT 320" },
    { id: "AST-002", name: "Forklift Toyota 3T" },
    { id: "AST-003", name: "Generator Perkins 50kVA" },
    { id: "AST-004", name: "Compressor Atlas Copco" },
    { id: "AST-005", name: "Crane Tadano 25T" },
    { id: "AST-006", name: "Dump Truck Hino 500" },
];

const locations = ["Bandung", "Jakarta", "Surabaya", "Cirebon", "Bogor", "Bekasi", "Depok"];

const times = ["07:15", "08:30", "09:45", "10:00", "11:20", "13:00", "14:30", "15:45", "16:10", "17:00"];

export const mockLogs: LogData[] = Array.from({ length: 32 }, (_, i) => {
    const driver = drivers[i % drivers.length];
    const vehicle = vehicles[i % vehicles.length];
    const asset = assets[i % assets.length];
    const day = String(((i % 28) + 1)).padStart(2, "0");
    const month = i < 15 ? "04" : "05";
    return {
        id: `LOG-${String(i + 1).padStart(4, "0")}`,
        date: `${day}/${month}/2026`,
        time: times[i % times.length],
        driverId: driver.id,
        driverName: driver.name,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        assetId: asset.id,
        assetName: asset.name,
        lastOdometer: 12000 + i * 850 + Math.round(Math.random() * 400),
        pictureUrl: i % 3 === 0 ? `https://placehold.co/80x60/e2e8f0/94a3b8?text=IMG` : undefined,
    };
});

export const allDrivers = drivers;
export const allVehicles = vehicles;
export const allAssets = assets;