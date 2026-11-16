export namespace TicketingTypes {
    export namespace Service {
        export type TicketStatus = "baru" | "on progress" | "selesai";
        export type TicketPriority = "low" | "medium" | "high";
        export type TicketCategory = "technical" | "fuel_log" | "quota" | "billing" | "other";

        export interface TicketData {
            id: string;
            organizationId?: string;
            organizationName: string;
            customerName: string;
            subject?: string;
            description?: string;
            reportType: string;
            reportDetail: string;
            category?: TicketCategory;
            priority?: TicketPriority;
            adminNotes?: string | null;
            attachmentUrl?: string;
            status: TicketStatus;
            createdAt: string;
            updatedAt?: string;
        }

        export interface TicketSummary {
            total: number;
            open: number;
            inProgress: number;
            resolved: number;
        }
    }
}
