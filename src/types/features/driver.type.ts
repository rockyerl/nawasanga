export type DriverStatus = "Aktif" | "Tidak Aktif";

export type LicenseType = "SIM A" | "SIM B1" | "SIM B2" | "SIM C" | "SIM D";

export interface DriverData {
    id: string;
    employeeId: string;
    name: string;
    licenseType: LicenseType;
    licenseNumber: string;
    licenseExpiry: string; // ISO date string "YYYY-MM-DD"
    phone: string;
    locationId: string;
    locationName: string;
    status: DriverStatus;
    notes: string;
}

export interface DriverFormValues {
    name: string;
    licenseType: LicenseType | "";
    licenseNumber: string;
    licenseExpiry: string;
    phone: string;
    locationId: string;
    status: DriverStatus | "";
    notes: string;
}