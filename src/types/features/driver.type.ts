export type DriverStatus = "Aktif" | "Tidak Aktif";

export type LicenseType = "SIM A" | "SIM B1" | "SIM B2" | "SIM C" | "SIM D" | "SIO Alat Berat";

export type DriverKycStatus = "verified" | "pending" | "rejected";

export interface DriverData {
    id: string;
    employeeId: string;
    name: string;
    nik?: string;
    licenseType: LicenseType;
    licenseNumber: string;
    licenseExpiry: string; // ISO date string "YYYY-MM-DD"
    phone: string;
    phoneNumber?: string;
    locationId: string;
    locationName: string;
    status: DriverStatus;
    kycStatus: DriverKycStatus;
    notes: string;
    avatarUrl?: string;
    assignedVehiclePlate?: string;
    fuelLogCount?: number;
    totalLiters?: number;
    totalCo2Kg?: number;
    organizationId?: string;
    createdAt?: string;
}

export interface DriverFormValues {
    name: string;
    nik?: string;
    licenseType: LicenseType | "";
    licenseNumber: string;
    licenseExpiry: string;
    phone: string;
    locationId: string;
    status: DriverStatus | "";
    kycStatus?: DriverKycStatus;
    notes: string;
}

export namespace DriverTypes {
    export namespace Service {
        export type DriverData = import('@/types/features/driver.type').DriverData;
    }
}
