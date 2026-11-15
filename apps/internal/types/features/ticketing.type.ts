export namespace TicketingTypes {
    export namespace Service {
        export type TicketStatus = "baru" | "on progress" | "selesai";

        export interface TicketData {
            id: string;
            organizationName: string;
            customerName: string;
            reportType: string;
            reportDetail: string;
            attachmentUrl?: string;
            status: TicketStatus;
            createdAt: string;
        }
    }
}