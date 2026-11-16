// Navigation and Menu Types
export interface NavigationMenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  requiredPermission: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface NavigationCategoryGroup {
  category: string;
  items: NavigationMenuItem[];
}

// User Session and Auth
export interface UserSession {
  userId: string;
  email: string;
  name: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  organizationId?: string | null;
  organizationName?: string | null;
  permissions: string[];
}

// Plan Types
export type PlanType = "trial" | "starter" | "pro" | "enterprise";

// Vehicle and Fuel Types
export interface VehicleInfo {
  id: string;
  plateNumber: string;
  model: string;
  vehicleType: string;
  fuelType: string;
  organizationId: string;
  assignedDriverId?: string | null;
  isActive: boolean;
}

// Carbon Emission Entry
export interface FuelEmissionLog {
  id: string;
  organizationId: string;
  vehicleId: string;
  driverId?: string | null;
  liters: number;
  fuelType: string;
  emissionCo2Kg: number;
  costIdr: number;
  odometerKm?: number | null;
  loggedAt: Date | string;
}

// API Response Standard (Sundawa BE-01)
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
