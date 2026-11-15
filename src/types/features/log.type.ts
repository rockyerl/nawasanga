import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace LogTypes {
    namespace Service {
        interface LogData {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: string;       // "DD/MM/YYYY"
            time: string;       // "HH:mm"
            driverId: string;
            driverName: string;
            vehicleId: string;
            vehicleName: string;
            assetId: string;
            assetName: string;
            lastOdometer: number;
            pictureUrl?: string;
            notes?: string;
        }

        type LogPagination =
            | HttpClientTypes.Response<Query.Pagination<LogData>>
            | HttpClientTypes.Response<unknown>;
    }
}