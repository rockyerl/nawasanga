import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export namespace VehicleTypeTypes {
    export namespace Service {

        export type Category =
            | 'motorcycle'
            | 'car'
            | 'light_truck'
            | 'medium_truck'
            | 'heavy_truck'
            | 'bus'
            | 'heavy_equipment'
            | 'operational';

        export interface VehicleTypeData {
            id: string;
            category: Category;
            name: string;
            defaultFuelTypeId: string | null;
            consumptionKm: number;        // kg CO₂ per km
            gvwMinTon: number | null;     // nullable
            description: string;
        }

        export type VehicleTypePagination =
            | HttpClientTypes.Response<Query.Pagination<VehicleTypeData>>
            | HttpClientTypes.Response<unknown>;
    }
}