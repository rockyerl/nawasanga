export namespace MonitoringTypes {
    export namespace Service {
        export interface MonitoringData {
            id: string;
            organizationName: string;
            totalAssets: number;
            lastLogin: string;
            totalEmissionLogs: number;
            totalUsers: number;
            lastDataSync: string;
        }
    }
}