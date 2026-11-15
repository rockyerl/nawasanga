export namespace FuelTypeTypes {
    export namespace Service {
        export type Unit = "liter" | "m3" | "kwh";

        export interface FuelTypeData {
            id:             string;
            name:           string;
            code:           string;
            emissionFactor: number;
            unit:           Unit;
            pricePerUnit:   number;
            isActive:       boolean;
            source:         string;
            updatedAt:      string;
        }
    }
}