export type LocationType = "Pool" | "Site" | "Warehouse" | "Branch";

export type LocationStatus = "Aktif" | "Tidak Aktif";

export interface Location {
    id: string;
    name: string;
    type: LocationType;
    province: string;
    city: string;
    address: string;
    pic: string;
    picPhone?: string;
    latitude?: number | null;
    longitude?: number | null;
    status: LocationStatus;
}

export interface LocationFormValues {
    name: string;
    type: LocationType | "";
    province: string;
    city: string;
    address: string;
    pic: string;
    picPhone?: string;
    latitude?: number | null;
    longitude?: number | null;
    status: LocationStatus | "";
}

export interface LocationListResponse {
    items: Location[];
    count: number;
    page: number;
    itemPerPage: number;
    totalPages: number;
}

export namespace LocationTypes {
    export namespace Service {
        export type LocationData = Location;
    }
}