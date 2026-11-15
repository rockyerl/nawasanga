import { OperationalTypes } from "@/types/features/operational.type";

const ASSET_TYPES   = ["Excavator", "Genset", "Forklift", "Pompa", "Crane", "Compressor"];
const FUEL_TYPES    = ["Solar", "Pertalite", "Pertamax", "LPG", "Listrik"];
const LOCATIONS     = ["Jakarta Pusat", "Jakarta Selatan", "Bandung", "Surabaya", "Medan", "Semarang"];
const STATUSES: OperationalTypes.Service.AssetStatus[] = ["Aktif", "Tidak Aktif", "Maintenance"];

export const mockAssets: OperationalTypes.Service.AssetData[] = [
    { id: "AST-001", name: "Excavator Unit 1",    type: "Excavator",  fuelType: "Solar",     serialNumber: "EXC-2401-001", power: "150 KW",  location: "Bandung",          fuelConsumption: "30 liter/jam",  status: "Aktif",       notes: "" },
    { id: "AST-002", name: "Genset Utama",         type: "Genset",     fuelType: "Solar",     serialNumber: "GNS-2401-001", power: "100 KW",  location: "Jakarta Pusat",    fuelConsumption: "25 liter/jam",  status: "Aktif",       notes: "Genset cadangan tersedia" },
    { id: "AST-003", name: "Forklift Gudang A",    type: "Forklift",   fuelType: "LPG",       serialNumber: "FLT-2401-001", power: "20 KW",   location: "Surabaya",         fuelConsumption: "8 liter/jam",   status: "Aktif",       notes: "" },
    { id: "AST-004", name: "Pompa Air 1",          type: "Pompa",      fuelType: "Listrik",   serialNumber: "PMP-2401-001", power: "15 KW",   location: "Semarang",         fuelConsumption: "0 liter/jam",   status: "Maintenance", notes: "Sedang perbaikan seal" },
    { id: "AST-005", name: "Crane Tower 1",        type: "Crane",      fuelType: "Solar",     serialNumber: "CRN-2401-001", power: "200 KW",  location: "Jakarta Selatan",  fuelConsumption: "45 liter/jam",  status: "Aktif",       notes: "" },
    { id: "AST-006", name: "Compressor Unit A",    type: "Compressor", fuelType: "Solar",     serialNumber: "CMP-2401-001", power: "55 KW",   location: "Medan",            fuelConsumption: "12 liter/jam",  status: "Tidak Aktif", notes: "Menunggu suku cadang" },
    { id: "AST-007", name: "Excavator Unit 2",     type: "Excavator",  fuelType: "Solar",     serialNumber: "EXC-2401-002", power: "180 KW",  location: "Surabaya",         fuelConsumption: "35 liter/jam",  status: "Aktif",       notes: "" },
    { id: "AST-008", name: "Genset Backup",        type: "Genset",     fuelType: "Solar",     serialNumber: "GNS-2401-002", power: "80 KW",   location: "Bandung",          fuelConsumption: "20 liter/jam",  status: "Aktif",       notes: "" },
    { id: "AST-009", name: "Forklift Gudang B",    type: "Forklift",   fuelType: "LPG",       serialNumber: "FLT-2401-002", power: "25 KW",   location: "Jakarta Pusat",    fuelConsumption: "10 liter/jam",  status: "Maintenance", notes: "Penggantian ban" },
    { id: "AST-010", name: "Pompa Bahan Bakar",    type: "Pompa",      fuelType: "Listrik",   serialNumber: "PMP-2401-002", power: "7 KW",    location: "Semarang",         fuelConsumption: "0 liter/jam",   status: "Aktif",       notes: "" },
    { id: "AST-011", name: "Crane Mobile 1",       type: "Crane",      fuelType: "Solar",     serialNumber: "CRN-2401-002", power: "250 KW",  location: "Medan",            fuelConsumption: "50 liter/jam",  status: "Aktif",       notes: "Beroperasi shift malam" },
    { id: "AST-012", name: "Compressor Unit B",    type: "Compressor", fuelType: "Pertalite", serialNumber: "CMP-2401-002", power: "37 KW",   location: "Jakarta Selatan",  fuelConsumption: "9 liter/jam",   status: "Tidak Aktif", notes: "" },
];

export { ASSET_TYPES, FUEL_TYPES, LOCATIONS, STATUSES };