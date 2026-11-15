import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export namespace OperationalTypes {
    export namespace Service {
        export type AssetStatus = 'Aktif' | 'Tidak Aktif' | 'Maintenance';

        export interface AssetData {
            id: string;
            name: string;
            type: string;
            fuelType: string;
            serialNumber: string;
            power: string;
            location: string;
            fuelConsumption: string;
            status: AssetStatus;
            notes: string;
        }

        export type AssetPagination =
            | HttpClientTypes.Response<Query.Pagination<AssetData>>
            | HttpClientTypes.Response<unknown>;
    }
}