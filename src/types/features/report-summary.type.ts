import { HttpClientTypes } from '@/types/lib/http-client.type';
import { Query } from '@/types/lib/query.type';

export declare namespace ReportTypes {
  namespace Service {
    type ReportStatus = 'Published' | 'Draft';

    interface ReportData {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      period: string;
      totalFuel: number;
      totalEmissions: number;
      totalVehicles: number;
      totalDrivers: number;
      avgEmissions: number;
      status: ReportStatus;
    }

    type ReportPagination =
      | HttpClientTypes.Response<Query.Pagination<ReportData>>
      | HttpClientTypes.Response<unknown>;
  }
}
