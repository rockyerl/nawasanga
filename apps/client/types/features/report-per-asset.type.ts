import { HttpClientTypes } from "@/types/lib/http-client.type";
import { Query } from "@/types/lib/query.type";

export declare namespace AssetTypes {
    namespace Service {
        type AssetStatus = "Baik" | "Perlu Perhatian" | "Kritis";

        interface AssetData {
            id: string;
            name: string;
            location?: string;
            totalEmissions: number;
            totalFuel: number;
            efficiency?: number;
            status?: AssetStatus;
            percentage?: number;
            rank: number;
        }

        type AssetPagination =
            | HttpClientTypes.Response<Query.Pagination<AssetData>>
            | HttpClientTypes.Response<unknown>;
    }
}